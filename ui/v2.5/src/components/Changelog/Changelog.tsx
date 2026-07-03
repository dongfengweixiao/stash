import React from "react";
import { useChangelogStorage } from "src/hooks/LocalForage";
import Version from "./Version";
import { doc } from "src/docs";
import { MarkdownPage } from "../Shared/MarkdownPage";
import { FormattedMessage, useIntl } from "react-intl";

const Changelog: React.FC = () => {
  const [{ data, loading }, setOpenState] = useChangelogStorage();
  const { locale } = useIntl();

  const stashVersion = import.meta.env.VITE_APP_STASH_VERSION;
  const buildTime = import.meta.env.VITE_APP_DATE;

  let buildDate: string | undefined;
  if (buildTime) {
    buildDate = buildTime.substring(0, buildTime.indexOf(" "));
  }

  if (loading) return null;

  const openState = data?.versions ?? {};

  const setVersionOpenState = (key: string, state: boolean) =>
    setOpenState({
      versions: {
        ...openState,
        [key]: state,
      },
    });

  interface IStashRelease {
    version: string;
    date?: string;
    changelogFile: string;
    defaultOpen?: boolean;
    releaseNotesFile?: string;
  }

  // after new release:
  // add entry to releases, using the current* fields
  // then update the current fields.
  const currentVersion = stashVersion || "v0.31.0";
  const currentDate = buildDate;

  const releases: IStashRelease[] = [
    {
      version: currentVersion,
      date: currentDate,
      changelogFile: "v0310.md",
      defaultOpen: true,
    },
    {
      version: "v0.30.1",
      date: "2025-12-18",
      changelogFile: "v0300.md",
      releaseNotesFile: "v0290.md",
    },
    {
      version: "v0.29.3",
      date: "2025-11-06",
      changelogFile: "v0290.md",
      releaseNotesFile: "v0290.md",
    },
    {
      version: "v0.28.1",
      date: "2025-03-20",
      changelogFile: "v0280.md",
    },
    {
      version: "v0.27.2",
      date: "2024-10-16",
      changelogFile: "v0270.md",
    },
    {
      version: "v0.26.2",
      date: "2024-06-27",
      changelogFile: "v0260.md",
    },
    {
      version: "v0.25.1",
      date: "2024-03-13",
      changelogFile: "v0250.md",
    },
    {
      version: "v0.24.3",
      date: "2024-01-15",
      changelogFile: "v0240.md",
    },
    {
      version: "v0.23.1",
      date: "2023-10-14",
      changelogFile: "v0230.md",
    },
    {
      version: "v0.22.1",
      date: "2023-08-21",
      changelogFile: "v0220.md",
    },
    {
      version: "v0.21.0",
      date: "2023-06-13",
      changelogFile: "v0210.md",
    },
    {
      version: "v0.20.2",
      date: "2023-04-08",
      changelogFile: "v0200.md",
    },
    {
      version: "v0.19.1",
      date: "2023-02-21",
      changelogFile: "v0190.md",
    },
    {
      version: "v0.18.0",
      date: "2022-11-30",
      changelogFile: "v0180.md",
    },
    {
      version: "v0.17.2",
      date: "2022-10-25",
      changelogFile: "v0170.md",
    },
    {
      version: "v0.16.1",
      date: "2022-07-26",
      changelogFile: "v0161.md",
    },
    {
      version: "v0.16.0",
      date: "2022-07-05",
      changelogFile: "v0160.md",
    },
    {
      version: "v0.15.0",
      date: "2022-05-18",
      changelogFile: "v0150.md",
    },
    {
      version: "v0.14.0",
      date: "2022-04-11",
      changelogFile: "v0140.md",
    },
    {
      version: "v0.13.1",
      date: "2022-03-16",
      changelogFile: "v0131.md",
    },
    {
      version: "v0.13.0",
      date: "2022-03-08",
      changelogFile: "v0130.md",
    },
    {
      version: "v0.12.0",
      date: "2021-12-29",
      changelogFile: "v0120.md",
    },
    {
      version: "v0.11.0",
      date: "2021-11-16",
      changelogFile: "v0110.md",
    },
    {
      version: "v0.10.0",
      date: "2021-10-11",
      changelogFile: "v0100.md",
    },
    {
      version: "v0.9.0",
      date: "2021-09-06",
      changelogFile: "v090.md",
    },
    {
      version: "v0.8.0",
      date: "2021-07-02",
      changelogFile: "v080.md",
    },
    {
      version: "v0.7.0",
      date: "2021-05-15",
      changelogFile: "v070.md",
    },
    {
      version: "v0.6.0",
      date: "2021-03-29",
      changelogFile: "v060.md",
    },
    {
      version: "v0.5.0",
      date: "2021-02-23",
      changelogFile: "v050.md",
    },
    {
      version: "v0.4.0",
      date: "2020-11-24",
      changelogFile: "v040.md",
    },
    {
      version: "v0.3.0",
      date: "2020-09-02",
      changelogFile: "v030.md",
    },
    {
      version: "v0.2.1",
      date: "2020-06-10",
      changelogFile: "v021.md",
    },
    {
      version: "v0.2.0",
      date: "2020-06-06",
      changelogFile: "v020.md",
    },
    {
      version: "v0.1.1",
      date: "2020-02-25",
      changelogFile: "v011.md",
    },
    {
      version: "v0.1.0",
      date: "2020-02-24",
      changelogFile: "v010.md",
    },
  ];

  return (
    <div className="changelog">
      <h1 className="mb-4">
        <FormattedMessage id="config.changelog.header" />
      </h1>
      {releases.map((r) => (
        <Version
          key={r.version}
          version={r.version}
          date={r.date}
          openState={openState}
          setOpenState={setVersionOpenState}
          defaultOpen={r.defaultOpen}
        >
          {r.releaseNotesFile && (
            <div>
              <h3 className="mt-0">
                <FormattedMessage id="release_notes" />
              </h3>
              <MarkdownPage page={doc(locale, `ReleaseNotes/${r.releaseNotesFile}`)} />
              <hr />
            </div>
          )}
          <MarkdownPage page={doc(locale, `Changelog/${r.changelogFile}`)} />
        </Version>
      ))}
    </div>
  );
};

export default Changelog;
