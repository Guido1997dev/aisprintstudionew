'use client';

import React, { useState, useEffect } from 'react';

export const WebhookSettings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load webhook URL from localStorage on mount
    const saved = localStorage.getItem('chatbox_webhook_url');
    if (saved) {
      setWebhookUrl(saved);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (webhookUrl.trim()) {
      localStorage.setItem('chatbox_webhook_url', webhookUrl);
      setIsSaved(true);
      setShowForm(false);
      console.log('✅ Webhook URL saved');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('chatbox_webhook_url');
    setWebhookUrl('');
    setIsSaved(false);
    console.log('🗑️ Webhook URL cleared');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    console.log('📋 Webhook URL copied to clipboard');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-[#303030]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold dark:text-white">Chatbox Webhook</h3>
          <div className="flex gap-2">
            {isSaved && (
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                ✅ Configured
              </span>
            )}
            {!isSaved && (
              <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                ⚠️ Not Set
              </span>
            )}
          </div>
        </div>

        {!showForm && isSaved ? (
          <>
            <div className="mb-4 p-3 bg-gray-50 dark:bg-[#252525] rounded text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
              {webhookUrl}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 px-3 py-2 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 px-3 py-2 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-2 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Clear
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                N8N Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com/webhook/..."
                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#252525] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Paste your n8n webhook URL here. It should start with https://
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  if (isSaved) setWebhookUrl(localStorage.getItem('chatbox_webhook_url') || '');
                }}
                className="flex-1 px-3 py-2 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">💡 How to get your webhook URL:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Create a webhook trigger in n8n</li>
            <li>Copy the webhook URL from n8n</li>
            <li>Paste it here and click Save</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WebhookSettings;
