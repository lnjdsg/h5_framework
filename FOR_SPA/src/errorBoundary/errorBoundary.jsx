
import React, { useState } from 'react';
import './errorBoundary.less'
const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const getDerivedStateFromError = (error) => {
        // 更新 state 报错之后的ui处理
        setHasError(true);
    };

    const componentDidCatch = (error, errorInfo) => {
        // 上报服务器
    };

    if (hasError) {
        // 报错之后的ui处理
        return <p className="errorPage">{'卧槽 崩了呀'}</p>;
    }

    return children;
};

export default ErrorBoundary;