import { cn } from '@kubedash/ui';
import { Send, Sparkles, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePulseStore } from '../stores/pulse';
import { PulseText } from './PulseText';

const quickActions = ['Explain this', 'Suggest fix', 'Create a view', 'What changed recently?'];

export function PulsePanel() {
  const { panelOpen, closePanel, messages, isProcessing, sendMessage, clearConversation } =
    usePulseStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Focus input when panel opens
  useEffect(() => {
    if (panelOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [panelOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelOpen) {
        closePanel();
      }
    },
    [panelOpen, closePanel],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    sendMessage(msg);
    setInput('');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-[var(--z-overlay)] transition-opacity duration-200',
          panelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Pulse AI"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[var(--z-drawer)] flex flex-col',
          'bg-[var(--surface-raised)] border-l border-[var(--pulse-border)]',
          'shadow-[var(--shadow-floating)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          panelOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ width: 420 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--pulse-accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Pulse</span>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                className="p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-muted)] transition-colors"
                title="Clear conversation"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={closePanel}
              className="p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-muted)] transition-colors"
              aria-label="Close Pulse"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Sparkles size={32} className="text-[var(--pulse-accent)] mb-3 opacity-40" />
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                Ask Pulse anything about your cluster
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Natural language questions, troubleshooting, custom views, and more
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-[var(--interactive-primary)] text-white'
                    : 'bg-[var(--surface-overlay)] border border-[var(--border-default)] text-[var(--text-primary)]',
                )}
              >
                {msg.role === 'pulse' ? <PulseText text={msg.content} /> : msg.content}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border-default)]">
                    {msg.actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="text-xs font-semibold text-[var(--pulse-accent)] hover:underline"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-accent)] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-accent)] animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pulse-accent)] animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {messages.length === 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleSubmit(action)}
                className="text-xs px-2.5 py-1 rounded-full border border-[var(--pulse-border)] text-[var(--pulse-accent)] hover:bg-[var(--pulse-accent-bg)] transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] px-3 py-2 focus-within:border-[var(--pulse-accent)] transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask Pulse anything..."
              className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              disabled={isProcessing}
            />
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isProcessing}
              className={cn(
                'p-1 rounded transition-colors',
                input.trim()
                  ? 'text-[var(--pulse-accent)] hover:bg-[var(--pulse-accent-bg)]'
                  : 'text-[var(--text-muted)]',
              )}
            >
              <Send size={14} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-xs text-[var(--text-muted)]">
              Pulse AI analyzes your cluster in real-time
            </span>
            <kbd className="text-xs text-[var(--text-muted)] border border-[var(--border-default)] rounded px-1 py-0.5 font-mono">
              ⌘J
            </kbd>
          </div>
        </div>
      </aside>
    </>
  );
}
