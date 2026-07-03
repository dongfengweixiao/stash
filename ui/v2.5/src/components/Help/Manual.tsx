import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { doc } from "src/docs";
import { MarkdownPage } from "../Shared/MarkdownPage";
import { useIntl } from "react-intl";

interface IManualProps {
  animation?: boolean;
  show: boolean;
  onClose: () => void;
  defaultActiveTab?: string;
}

export const Manual: React.FC<IManualProps> = ({
  animation,
  show,
  onClose,
  defaultActiveTab,
}) => {
  const intl = useIntl();
  const { locale } = intl;

  const content: {
    key: string;
    titleId: string;
    className?: string;
  }[] = [
    { key: "Introduction.md", titleId: "manual.introduction" },
    { key: "Configuration.md", titleId: "manual.configuration" },
    { key: "Interface.md", titleId: "manual.interface_options" },
    { key: "Tasks.md", titleId: "manual.tasks" },
    {
      key: "Identify.md",
      titleId: "manual.identify",
      className: "indent-1",
    },
    {
      key: "AutoTagging.md",
      titleId: "manual.auto_tagging",
      className: "indent-1",
    },
    {
      key: "SceneFilenameParser.md",
      titleId: "manual.scene_filename_parser",
      className: "indent-1",
    },
    {
      key: "JSONSpec.md",
      titleId: "manual.json_specification",
      className: "indent-1",
    },
    { key: "Browsing.md", titleId: "manual.browsing" },
    { key: "Images.md", titleId: "manual.images_and_galleries" },
    { key: "Scraping.md", titleId: "manual.metadata_scraping" },
    {
      key: "ScraperDevelopment.md",
      titleId: "manual.scraper_development",
      className: "indent-1",
    },
    { key: "Plugins.md", titleId: "manual.plugins" },
    {
      key: "ExternalPlugins.md",
      titleId: "manual.external_plugins",
      className: "indent-1",
    },
    {
      key: "EmbeddedPlugins.md",
      titleId: "manual.embedded_plugins",
      className: "indent-1",
    },
    {
      key: "UIPluginApi.md",
      titleId: "manual.ui_plugin_api",
      className: "indent-1",
    },
    { key: "Tagger.md", titleId: "manual.scene_tagger" },
    { key: "Deduplication.md", titleId: "manual.dupe_checker" },
    { key: "Interactive.md", titleId: "manual.interactivity" },
    { key: "Captions.md", titleId: "manual.captions" },
    { key: "KeyboardShortcuts.md", titleId: "manual.keyboard_shortcuts" },
    {
      key: "TroubleshootingMode.md",
      titleId: "manual.troubleshooting_mode",
    },
    { key: "Contributing.md", titleId: "manual.contributing" },
    { key: "Help.md", titleId: "manual.further_help" },
  ];

  const [activeTab, setActiveTab] = useState<string>();

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  // links to other manual pages are specified as "/help/page.md"
  // intercept clicks to these pages and set the tab accordingly
  function interceptLinkClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (event.target instanceof HTMLAnchorElement) {
      const href = event.target.getAttribute("href");
      if (href?.startsWith("/help")) {
        const newKey = event.target.pathname.substring("/help/".length);
        setActiveTab(newKey);
        event.preventDefault();
      }
    }
  }

  return (
    <Modal
      animation={animation}
      show={show}
      onHide={onClose}
      dialogClassName="modal-dialog-scrollable manual modal-xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Help</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="manual-container">
          <Tab.Container
            activeKey={activeTab ?? content[0].key}
            onSelect={(k) => k && setActiveTab(k)}
            id="manual-tabs"
          >
            <Row>
              <Col lg={3} className="mb-3 mb-lg-0 manual-toc">
                <Nav variant="pills" className="flex-column">
                  {content.map((c) => {
                    return (
                      <Nav.Item key={`${c.key}-nav`}>
                        <Nav.Link className={c.className} eventKey={c.key}>
                          {intl.formatMessage({ id: c.titleId })}
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                  <hr className="d-sm-none" />
                </Nav>
              </Col>
              <Col lg={9} className="manual-content">
                <Tab.Content>
                  {content.map((c) => {
                    return (
                      <Tab.Pane
                        eventKey={c.key}
                        key={`${c.key}-pane`}
                        onClick={interceptLinkClick}
                      >
                        <MarkdownPage page={doc(locale, `Manual/${c.key}`)} />
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Manual;
