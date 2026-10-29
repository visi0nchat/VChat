import { useMemo, useState } from "react";
import {
  Search, Plus, Send, Paperclip, Smile, Phone, Video, MoreVertical,
  MessageCircle, Users, Radio, PhoneCall, Settings, Compass, Bell,
  CheckCheck, Menu, X, Hash
} from "lucide-react";
import "./App.css";

const starterChats = [
  { id: 1, name: "Amara Sesay", initials: "AS", color: "mint", preview: "Are we still meeting today?", time: "10:42", unread: 2, online: true, messages: [
    { id: 1, from: "them", text: "Hey! How is your day going?", time: "10:38" },
    { id: 2, from: "me", text: "It's going well, thanks. How about yours?", time: "10:40" },
    { id: 3, from: "them", text: "Are we still meeting today?", time: "10:42" }
  ]},
  { id: 2, name: "VisionChat Community", initials: "VC", color: "blue", preview: "Ibrahim: Welcome everyone 👋", time: "09:18", unread: 0, online: false, group: true, messages: [
    { id: 1, from: "them", text: "Welcome everyone 👋 Let's make this a helpful community.", time: "09:18" }
  ]},
  { id: 3, name: "Ibrahim Kamara", initials: "IK", color: "gold", preview: "Sent you the details.", time: "Yesterday", unread: 0, online: false, messages: [
    { id: 1, from: "them", text: "Sent you the details.", time: "Yesterday" }
  ]},
  { id: 4, name: "Study Circle", initials: "SC", color: "purple", preview: "Fatmata: Notes are ready", time: "Mon", unread: 0, online: false, group: true, messages: [
    { id: 1, from: "them", text: "Notes are ready for everyone.", time: "Mon" }
  ]}
];

const navItems = [
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "groups", label: "Groups", icon: Users },
  { id: "channels", label: "Channels", icon: Radio },
  { id: "calls", label: "Calls", icon: PhoneCall },
  { id: "discover", label: "Discover", icon: Compass }
];

function Avatar({ chat, small = false }) {
  return <div className={`avatar ${chat.color || "mint"} ${small ? "small" : ""}`}>{chat.initials}</div>;
}

export default function App() {
  const [chats, setChats] = useState(starterChats);
  const [activeId, setActiveId] = useState(1);
  const [section, setSection] = useState("messages");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const activeChat = chats.find((chat) => chat.id === activeId) || chats[0];
  const visibleChats = useMemo(() => chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()) &&
    (section !== "groups" || chat.group)
  ), [chats, search, section]);

  function chooseChat(chat) {
    setActiveId(chat.id);
    setMobileChatOpen(true);
    setSection("messages");
    setChats((old) => old.map((item) => item.id === chat.id ? { ...item, unread: 0 } : item));
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const message = { id: Date.now(), from: "me", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setChats((old) => old.map((chat) => chat.id === activeId
      ? { ...chat, preview: text, time: message.time, messages: [...chat.messages, message] }
      : chat));
    setDraft("");
  }

  function createChat() {
    const name = window.prompt("Enter a name for this demo conversation:");
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const chat = {
      id: Date.now(), name: cleanName, initials: cleanName.split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase(),
      color: "blue", preview: "Start a conversation", time: "Now", unread: 0, online: false, messages: []
    };
    setChats((old) => [chat, ...old]);
    setActiveId(chat.id);
    setSection("messages");
    setMobileChatOpen(true);
  }

  const currentSection = navItems.find((item) => item.id === section)?.label || "Messages";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><span>V</span><i /></div>
          <div className="brand-copy"><strong>VisionChat</strong><small>Connect. Share. Be heard.</small></div>
          <button className="icon-button mobile-only" aria-label="Close menu" onClick={() => setMobileChatOpen(false)}><X size={18} /></button>
        </div>

        <button className="profile-card" onClick={() => setShowNotice(true)}>
          <div className="profile-avatar">Y</div>
          <div className="profile-text"><strong>Your profile</strong><small>Set up your account</small></div>
          <MoreVertical size={17} />
        </button>

        <div className="side-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${section === id ? "active" : ""}`} onClick={() => { setSection(id); setMobileChatOpen(false); }}>
              <Icon size={19} strokeWidth={1.8} /><span>{label}</span>
              {id === "messages" && <span className="nav-count">{chats.reduce((sum, c) => sum + c.unread, 0) || ""}</span>}
            </button>
          ))}
        </nav>

        <div className="side-label recent-label">YOUR SPACE <button className="tiny-add" aria-label="New chat" onClick={createChat}><Plus size={15} /></button></div>
        <div className="mini-space"><div className="space-dot green-dot" /> Personal messages</div>
        <div className="mini-space"><div className="space-dot blue-dot" /> Salone community</div>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setShowNotice(true)}><Bell size={19} /><span>Notifications</span><span className="live-dot" /></button>
          <button className="nav-item" onClick={() => setShowNotice(true)}><Settings size={19} /><span>Settings</span></button>
          <div className="security-note"><div className="security-symbol">✦</div><div><strong>Your space, your voice.</strong><small>Built for meaningful connections.</small></div></div>
        </div>
      </aside>

      <main className={`chat-list-panel ${mobileChatOpen ? "hide-mobile" : ""}`}>
        <header className="list-header">
          <div><div className="eyebrow">YOUR WORKSPACE</div><h1>{currentSection}</h1></div>
          <button className="new-chat-button" onClick={createChat}><Plus size={17} /><span>New</span></button>
        </header>
        <label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations" /></label>

        {section === "messages" || section === "groups" ? (
          <>
            <div className="list-section-title">{section === "groups" ? "YOUR GROUPS" : "RECENT CHATS"} <span>{visibleChats.length}</span></div>
            <div className="conversation-list">
              {visibleChats.map((chat) => (
                <button key={chat.id} className={`conversation ${activeId === chat.id ? "selected" : ""}`} onClick={() => chooseChat(chat)}>
                  <div className="avatar-wrap"><Avatar chat={chat} />{chat.online && <span className="online-dot" />}</div>
                  <div className="conversation-content"><div className="conversation-top"><strong>{chat.name}</strong><time>{chat.time}</time></div><div className="conversation-bottom"><span>{chat.preview}</span>{chat.unread > 0 && <b className="unread">{chat.unread}</b>}</div></div>
                </button>
              ))}
              {visibleChats.length === 0 && <div className="empty-state">No conversations found.</div>}
            </div>
          </>
        ) : (
          <div className="feature-placeholder">
            <div className="placeholder-icon">{section === "channels" ? <Radio /> : section === "calls" ? <PhoneCall /> : <Compass />}</div>
            <h2>{section === "channels" ? "Channels are coming" : section === "calls" ? "Calls are coming" : "Discover VisionChat"}</h2>
            <p>{section === "channels" ? "Follow updates and public broadcasts from communities you care about." : section === "calls" ? "Audio and video calls will be added in a later development stage." : "Find people, communities, and conversations that matter to you."}</p>
            <button className="outline-button" onClick={() => setShowNotice(true)}>Learn about the prototype</button>
          </div>
        )}
        <div className="list-footer"><span className="footer-status" /> Prototype workspace <span>v0.1</span></div>
      </main>

      <section className={`conversation-panel ${mobileChatOpen ? "show-mobile" : ""}`}>
        {activeChat ? (
          <>
            <header className="conversation-header">
              <button className="icon-button mobile-only" aria-label="Back to chats" onClick={() => setMobileChatOpen(false)}><Menu size={19} /></button>
              <Avatar chat={activeChat} small />
              <div className="header-person"><strong>{activeChat.name}</strong><small>{activeChat.online ? "● Online now" : activeChat.group ? "Group conversation" : "VisionChat member"}</small></div>
              <div className="header-actions"><button className="icon-button" aria-label="Audio call" onClick={() => setShowNotice(true)}><Phone size={18} /></button><button className="icon-button" aria-label="Video call" onClick={() => setShowNotice(true)}><Video size={19} /></button><button className="icon-button" aria-label="More options" onClick={() => setShowNotice(true)}><MoreVertical size={19} /></button></div>
            </header>
            <div className="encryption-banner"><span>✦</span> Welcome to your VisionChat demo. Messages here are local to this browser.</div>
            <div className="message-area">
              <div className="date-divider"><span>TODAY</span></div>
              {activeChat.messages.map((message) => (
                <div key={message.id} className={`message-row ${message.from === "me" ? "mine" : ""}`}>
                  {message.from !== "me" && <Avatar chat={activeChat} small />}
                  <div className="message-bubble"><p>{message.text}</p><div className="message-meta"><time>{message.time}</time>{message.from === "me" && <CheckCheck size={14} />}</div></div>
                </div>
              ))}
            </div>
            <form className="composer" onSubmit={sendMessage}>
              <button type="button" className="icon-button attach-button" aria-label="Attach file" onClick={() => setShowNotice(true)}><Paperclip size={19} /></button>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${activeChat.name}`} aria-label="Message" />
              <button type="button" className="icon-button emoji-button" aria-label="Emoji" onClick={() => setDraft((old) => old + " 😊")}><Smile size={19} /></button>
              <button type="submit" className="send-button" aria-label="Send message" disabled={!draft.trim()}><Send size={17} /></button>
            </form>
            <div className="prototype-disclaimer">VisionChat is an early prototype · Real accounts and delivery are not connected</div>
          </>
        ) : <div className="empty-state">Choose a conversation to begin.</div>}
      </section>

      {showNotice && <div className="modal-backdrop" role="presentation" onClick={() => setShowNotice(false)}><div className="notice-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}><button className="modal-close icon-button" onClick={() => setShowNotice(false)} aria-label="Close"><X size={18} /></button><div className="modal-mark">V</div><h2>Coming in a later stage</h2><p>This starter shows the VisionChat interface. Real accounts, cloud messages, media sharing, notifications, and calls need secure backend setup before they can work between users.</p><button className="primary-button" onClick={() => setShowNotice(false)}>Got it</button></div></div>}
    </div>
  );
}
