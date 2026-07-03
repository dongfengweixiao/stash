export interface IReleaseNotes {
  // handle should be in the form of YYYYMMDD
  date: number;
  version: string;
  content: string;
}

const docUrls = import.meta.glob("./*/*/*.md", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function localeDir(locale: string): string {
  return locale === "zh-CN" ? "zh-CN" : "en";
}

/** Resolve a document for the given locale, falling back to English when the
 *  locale's translation is missing. */
export function doc(locale: string, relPath: string): string {
  return (
    docUrls[`./${localeDir(locale)}/${relPath}`] ??
    docUrls[`./en/${relPath}`] ??
    ""
  );
}

export const releaseVersions: { date: number; version: string; file: string }[] = [
  { date: 20251026, version: "v0.29.0", file: "ReleaseNotes/v0290.md" },
  { date: 20240826, version: "v0.27.0", file: "ReleaseNotes/v0270.md" },
  { date: 20240510, version: "v0.26.0", file: "ReleaseNotes/v0260.md" },
  { date: 20240228, version: "v0.25.0", file: "ReleaseNotes/v0250.md" },
  { date: 20231212, version: "v0.24.0", file: "ReleaseNotes/v0240.md" },
  { date: 20230301, version: "v0.20.0", file: "ReleaseNotes/v0200.md" },
  { date: 20220906, version: "v0.17.0", file: "ReleaseNotes/v0170.md" },
];

export function releaseNotesFor(locale: string): IReleaseNotes[] {
  return releaseVersions.map((r) => ({
    date: r.date,
    version: r.version,
    content: doc(locale, r.file),
  }));
}

export function migrationNote(locale: string, id: number): string {
  return doc(locale, `MigrationNotes/${id}.md`);
}
