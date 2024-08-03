## TODO

- [ ] Archiving chats
- [ ] Message/Chats pinning feature
- [ ] Reactions to messages
- [ ] Drag and drop functionality for sidebar chats
- [ ] Local passcode protection
- [ ] Support Markdown (for links and etc)
- [ ] Optimistic UI for message sending
- [ ] Display online/offline/last seen statuses
- [ ] Groups
- [ ] Channels
- [ ] Password reset
- [ ] Conversation deletion
- [ ] Refresh cookies for sockets upon reconnection

## IN WORK

- [ ] Light theme
- [ ] Settings modal
- [ ] Rewrite the useCreateGroup hook

## DONE

**Complete**
- [x] Improved focus trap functionality
- [x] Implemented message editing
- [x] Added asynchronous handling in global modal
- [x] Centered text in textarea or created a custom solution
- [x] Developed verification UI
- [x] Saved last input between conversations
- [x] Rewrote MessagesList as a reusable component
- [x] Reserved nicknames feature added
- [x] Implemented socket authentication on every action (verified if the current client can send messages for conversation/group before sending)
- [x] Added grouped messages feature
- [x] Implemented sticky avatar for grouped messages
- [x] Rewrote socket events from @SubscribeMessage to @OnEvent where necessary
- [x] Improved chat bubbles
- [x] Added WebSocket support for sending, deleting, and editing messages, and for creating, editing, and deleting conversations @{20.07.2024}
- [x] Enhanced error handling
- [x] Developed reusable components for the Auth page
- [x] Added display name for user model
- [x] Implemented logout functionality
- [x] Enabled session deletion upon logout
- [x] Considered moving some logic from useLayout hook to useSidebar
- [x] Improved useLayout hook with structured return
- [x] Implemented refresh token logic (server-side)
- [x] Added socket.io authentication
- [x] Reworked sockets Map to a Map with an array of sockets, allowing users to join from both browser and phone, receiving all events on both devices
- [x] Implemented change password functionality
- [x] Implemented nested modals feature
