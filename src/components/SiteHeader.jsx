import { useState } from 'react';
import { Layout, Menu, Button, Drawer, Grid, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { site } from '../config/site.js';

const { Header } = Layout;
const { useBreakpoint } = Grid;

function scrollToSection(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function SiteHeader() {
  const screens = useBreakpoint();
  const showDrawer = !screens.md;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (sectionId) => {
    scrollToSection(sectionId);
    setDrawerOpen(false);
  };

  const menuItems = site.navItems.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: () => handleNav(item.key),
  }));

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(139, 115, 85, 0.15)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Typography.Link
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          handleNav('hero');
        }}
        style={{
          fontWeight: 700,
          fontSize: screens.xs ? 16 : 18,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: showDrawer ? 'calc(100vw - 120px)' : 'none',
        }}
      >
        {site.businessName}
      </Typography.Link>

      {showDrawer ? (
        <>
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            style={{ minWidth: 48, minHeight: 48 }}
          />
          <Drawer
            title={site.businessName}
            placement="right"
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            width={280}
            styles={{ body: { padding: 0 } }}
          >
            <Menu
              mode="vertical"
              items={menuItems}
              style={{ border: 'none' }}
              selectable={false}
            />
          </Drawer>
        </>
      ) : (
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            minWidth: 0,
            border: 'none',
            background: 'transparent',
          }}
          selectable={false}
        />
      )}
    </Header>
  );
}
