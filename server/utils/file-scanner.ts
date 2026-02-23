import { readFile, unlink } from "fs/promises";
import path from "path";
import { fileTypeFromBuffer } from "file-type";

export interface ScanResult {
  safe: boolean;
  reason?: string;
  threat?: "malware_signature" | "mime_mismatch" | "dangerous_content" | "suspicious_filename";
}

const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
  "application/pdf": [".pdf"],
  "text/plain": [".txt", ".text", ".log", ".csv"],
  "text/csv": [".csv"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
};

// Magic bytes for known executable / malware formats
const DANGEROUS_SIGNATURES: { name: string; bytes: number[]; offset?: number }[] = [
  { name: "Windows PE executable", bytes: [0x4d, 0x5a] },
  { name: "ELF executable", bytes: [0x7f, 0x45, 0x4c, 0x46] },
  { name: "Mach-O 64-bit executable", bytes: [0xcf, 0xfa, 0xed, 0xfe] },
  { name: "Mach-O 32-bit executable", bytes: [0xce, 0xfa, 0xed, 0xfe] },
  { name: "Java class file", bytes: [0xca, 0xfe, 0xba, 0xbe] },
  { name: "COM executable", bytes: [0xc9, 0xc9] },
  { name: "Windows batch shortcut", bytes: [0x4c, 0x00, 0x00, 0x00] },
];

// Patterns that indicate embedded malicious content in otherwise-valid documents
const DANGEROUS_CONTENT_PATTERNS: { pattern: RegExp; description: string }[] = [
  { pattern: /\/JavaScript\s/i, description: "Embedded JavaScript in PDF" },
  { pattern: /\/JS\s*\(/i, description: "JavaScript action in PDF" },
  { pattern: /\/Launch\s/i, description: "Launch action in PDF (can execute programs)" },
  { pattern: /\/OpenAction\s/i, description: "Auto-execute action in PDF" },
  { pattern: /\/AA\s*<</i, description: "Additional actions trigger in PDF" },
  { pattern: /\/RichMedia\s/i, description: "Rich media (Flash) embedded in PDF" },
  { pattern: /<script[\s>]/i, description: "HTML script tag in file" },
  { pattern: /javascript\s*:/i, description: "JavaScript URI scheme" },
  { pattern: /<\?php/i, description: "PHP code in file" },
  { pattern: /<%[\s=@]/i, description: "Server-side script tag (ASP/JSP)" },
  { pattern: /\beval\s*\(/i, description: "eval() call (potential code injection)" },
  { pattern: /\bexec\s*\(/i, description: "exec() call (potential command execution)" },
  { pattern: /powershell\s+-/i, description: "PowerShell command" },
  { pattern: /cmd\s*\/[ck]\s/i, description: "Windows command execution" },
  { pattern: /\bvbs(?:cript)?\s*:/i, description: "VBScript URI scheme" },
];

// Patterns for Office document macro indicators (found inside ZIP-based .docx/.xlsx)
const OFFICE_MACRO_PATTERNS: { pattern: Buffer; description: string }[] = [
  { pattern: Buffer.from("vbaProject.bin"), description: "VBA macro project in Office document" },
  { pattern: Buffer.from("xl/macrosheets"), description: "Excel macro sheets" },
  { pattern: Buffer.from("word/vbaData.xml"), description: "Word VBA data" },
];

const SUSPICIOUS_FILENAME_PATTERNS: RegExp[] = [
  /\.\w+\.\w+$/, // double extensions like file.pdf.exe
  /\x00/, // null bytes
  /\.\.(\/|\\)/, // path traversal
  /^\./, // hidden files
  /\.(exe|bat|cmd|com|msi|scr|pif|vbs|vbe|wsf|wsh|ps1|sh|bash|csh|ksh)$/i,
];

function matchesSignature(buffer: Buffer, signature: { bytes: number[]; offset?: number }): boolean {
  const offset = signature.offset ?? 0;
  if (buffer.length < offset + signature.bytes.length) return false;
  return signature.bytes.every((byte, i) => buffer[offset + i] === byte);
}

function isTextMime(mimeType: string): boolean {
  return mimeType.startsWith("text/");
}

/**
 * Scans a file for malware signatures, MIME type mismatches,
 * dangerous content patterns, and suspicious filenames.
 */
export async function scanFile(
  filePath: string,
  declaredMimeType: string,
  originalFilename: string
): Promise<ScanResult> {
  // 1. Filename checks
  const filenameResult = scanFilename(originalFilename);
  if (!filenameResult.safe) return filenameResult;

  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch {
    return { safe: false, reason: "Unable to read file for security scanning", threat: "malware_signature" };
  }

  // 2. Malware signature check
  for (const sig of DANGEROUS_SIGNATURES) {
    if (matchesSignature(buffer, sig)) {
      return {
        safe: false,
        reason: `File contains ${sig.name} signature — executable files are not allowed`,
        threat: "malware_signature",
      };
    }
  }

  // 3. Shell script shebang check
  const firstLine = buffer.subarray(0, Math.min(256, buffer.length)).toString("utf-8");
  if (/^#!\s*\//.test(firstLine)) {
    return {
      safe: false,
      reason: "File appears to be an executable script (shebang detected)",
      threat: "malware_signature",
    };
  }

  // 4. Magic byte MIME validation (skip for plain text, which has no reliable magic bytes)
  if (!isTextMime(declaredMimeType)) {
    const detected = await fileTypeFromBuffer(buffer);
    if (detected) {
      const allowedMimes = getAllowedMimesForDeclared(declaredMimeType);
      if (!allowedMimes.includes(detected.mime)) {
        return {
          safe: false,
          reason: `File content does not match declared type "${declaredMimeType}" — actual type detected as "${detected.mime}"`,
          threat: "mime_mismatch",
        };
      }
    }
  }

  // 5. Dangerous content pattern scan
  const contentStr = buffer.subarray(0, Math.min(64 * 1024, buffer.length)).toString("utf-8");
  for (const { pattern, description } of DANGEROUS_CONTENT_PATTERNS) {
    if (pattern.test(contentStr)) {
      return {
        safe: false,
        reason: `Potentially malicious content detected: ${description}`,
        threat: "dangerous_content",
      };
    }
  }

  // 6. Office macro detection (for ZIP-based Office formats)
  if (isZipBasedOffice(declaredMimeType)) {
    for (const { pattern, description } of OFFICE_MACRO_PATTERNS) {
      if (buffer.includes(pattern)) {
        return {
          safe: false,
          reason: `${description} — macro-enabled documents are not allowed for security reasons`,
          threat: "dangerous_content",
        };
      }
    }
  }

  return { safe: true };
}

function scanFilename(filename: string): ScanResult {
  for (const pattern of SUSPICIOUS_FILENAME_PATTERNS) {
    if (pattern.test(filename)) {
      return {
        safe: false,
        reason: `Suspicious filename "${filename}" — file rejected for security reasons`,
        threat: "suspicious_filename",
      };
    }
  }
  return { safe: true };
}

function isZipBasedOffice(mimeType: string): boolean {
  return [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ].includes(mimeType);
}

/**
 * For a declared MIME type, returns the set of actual MIME types
 * that are acceptable (accounts for minor variations in detection).
 */
function getAllowedMimesForDeclared(declaredMime: string): string[] {
  const mapping: Record<string, string[]> = {
    "image/jpeg": ["image/jpeg"],
    "image/png": ["image/png"],
    "image/gif": ["image/gif"],
    "image/webp": ["image/webp"],
    "image/heic": ["image/heic", "image/heif"],
    "image/heif": ["image/heic", "image/heif"],
    "application/pdf": ["application/pdf"],
    "application/msword": ["application/msword", "application/x-cfb"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    "application/vnd.ms-excel": ["application/vnd.ms-excel", "application/x-cfb"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  };
  return mapping[declaredMime] ?? [declaredMime];
}

/**
 * Scans an array of uploaded files. Returns the first failure found,
 * or a success result if all files pass. Automatically deletes
 * any file that fails the scan.
 */
export async function scanUploadedFiles(
  files: Express.Multer.File[]
): Promise<{ passed: boolean; failedFile?: string; result?: ScanResult }> {
  for (const file of files) {
    const result = await scanFile(file.path, file.mimetype, file.originalname);
    if (!result.safe) {
      // Delete the dangerous file immediately
      try { await unlink(file.path); } catch { /* already cleaned up */ }
      (await import("./logger")).logger.warn(
        { filename: file.originalname, reason: result.reason },
        "[security] Blocked malicious upload"
      );
      return { passed: false, failedFile: file.originalname, result };
    }
  }
  return { passed: true };
}
