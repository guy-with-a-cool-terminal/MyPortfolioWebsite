import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Check, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  verifyPin,
  sendMessage,
  confirmLog,
  type ChatMessage,
  type DraftEntry,
} from '@/utils/chatClient';

const PIN_STORAGE_KEY = 'notion-chat-pin';
const HISTORY_STORAGE_KEY = 'notion-chat-history';

const getErrorMessage = (err: unknown): string => (err instanceof Error ? err.message : 'Something went wrong.');

const Chat: React.FC = () => {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = sessionStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<DraftEntry | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optimistic: trust a stored PIN until the worker says otherwise (a 401 anywhere
    // below clears it and drops back to the gate, see notion-chat/DECISIONS.md #5).
    if (sessionStorage.getItem(PIN_STORAGE_KEY)) setVerified(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingDraft]);

  const getPin = () => sessionStorage.getItem(PIN_STORAGE_KEY) || '';

  const dropSession = (message: string) => {
    sessionStorage.removeItem(PIN_STORAGE_KEY);
    setVerified(false);
    setPinError(message);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput) return;
    setVerifying(true);
    setPinError(null);
    const ok = await verifyPin(pinInput);
    setVerifying(false);
    if (ok) {
      sessionStorage.setItem(PIN_STORAGE_KEY, pinInput);
      setPinInput('');
      setVerified(true);
    } else {
      setPinError('Wrong PIN.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setSending(true);
    setError(null);

    try {
      const result = await sendMessage(getPin(), next);
      setMessages([...next, { role: 'assistant', content: result.reply }]);
      // A turn that didn't re-propose (e.g. a stats question asked mid-draft) must not
      // silently wipe an existing unconfirmed draft.
      if (result.draft) setPendingDraft(result.draft);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.includes('401') || message.toLowerCase().includes('pin')) {
        dropSession('Session expired. Re-enter your PIN.');
      } else {
        setError(message);
      }
    } finally {
      setSending(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingDraft) return;
    setConfirming(true);
    try {
      const result = await confirmLog(getPin(), pendingDraft);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.ok ? '✅ Logged to Notion.' : `❌ Failed to log: ${result.error || 'unknown error'}`,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `❌ Failed to log: ${getErrorMessage(err)}` }]);
    } finally {
      setPendingDraft(null);
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    setMessages((prev) => [...prev, { role: 'assistant', content: 'Cancelled. Nothing was logged.' }]);
    setPendingDraft(null);
  };

  if (!verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle>Enter PIN</CardTitle>
          </CardHeader>
          <form onSubmit={handleUnlock}>
            <CardContent className="flex flex-col gap-3">
              <Input
                type="password"
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                className="text-center tracking-widest"
              />
              {pinError && <p className="text-sm text-destructive text-center">{pinError}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={verifying || !pinInput}>
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">What did you work on?</h1>
        <p className="text-sm text-muted-foreground">Tell me what you did, and I'll draft a Notion entry for you to confirm.</p>
      </header>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Try: "spent today fixing the gateway service restart bug" or "what should I prioritize this week?"
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-card-foreground'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {pendingDraft && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-base">Confirm this entry?</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-1.5 text-sm">
                <div>
                  <span className="text-muted-foreground">Task: </span>
                  {pendingDraft.task}
                </div>
                <div>
                  <span className="text-muted-foreground">Category: </span>
                  {pendingDraft.category}
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  {pendingDraft.status}
                </div>
                <div>
                  <span className="text-muted-foreground">Due date: </span>
                  {pendingDraft.due_date}
                </div>
                {pendingDraft.completed_date && (
                  <div>
                    <span className="text-muted-foreground">Completed date: </span>
                    {pendingDraft.completed_date}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleConfirm} disabled={confirming} size="sm" className="gap-1.5">
                  {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Confirm
                </Button>
                <Button onClick={handleCancel} disabled={confirming} size="sm" variant="outline" className="gap-1.5">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          )}

          {sending && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-border bg-card px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={pendingDraft ? 'Confirm above, or say what to change...' : 'What did you work on today?'}
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={sending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
