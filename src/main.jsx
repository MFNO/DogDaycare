import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App.jsx';
import './index.css';

// Central Ant Design theme — adjust colors here for a quick rebrand
const theme = {
  token: {
    colorPrimary: '#8B7355',
    colorInfo: '#A69076',
    colorSuccess: '#7D9B76',
    colorWarning: '#D4A574',
    colorError: '#C45C5C',
    colorBgLayout: '#FAF7F2',
    colorText: '#3d3429',
    colorTextSecondary: '#5c5349',
    borderRadius: 10,
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      bodyBg: '#FAF7F2',
      headerBg: 'rgba(250, 247, 242, 0.92)',
      footerBg: '#efe8dd',
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(61, 52, 41, 0.06)',
    },
    Card: {
      colorBgContainer: '#fffefb',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
