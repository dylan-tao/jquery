# jQuery 4.0.0 with Beeico Storage Module

## Overview

Beeico Storage module provides a unified API for **localStorage** and **sessionStorage**. It offers consistent interfaces with error handling and convenience methods.

**Note**: This module does NOT provide a Cookie API. Cookies should be managed by the backend with proper security settings (HttpOnly, SameSite, Secure). For client-side data storage, prefer localStorage or sessionStorage.

## API Reference

### LocalStorage API

| Method | Description |
|--------|-------------|
| `$.beeico.storage.local.supported()` | Check if localStorage is supported |
| `$.beeico.storage.local.enable()` | Show user guide to enable permissions |
| `$.beeico.storage.local.set(key, value)` | Set item with metadata |
| `$.beeico.storage.local.get(key)` | Get item, returns null if not exists |
| `$.beeico.storage.local.remove(key)` | Remove item |
| `$.beeico.storage.local.clear()` | Clear all prefixed items |
| `$.beeico.storage.local.keys()` | Get all prefixed keys |

### SessionStorage API

| Method | Description |
|--------|-------------|
| `$.beeico.storage.session.supported()` | Check if sessionStorage is supported |
| `$.beeico.storage.session.enable()` | Show user guide to enable permissions |
| `$.beeico.storage.session.set(key, value)` | Set item with metadata |
| `$.beeico.storage.session.get(key)` | Get item, returns null if not exists |
| `$.beeico.storage.session.remove(key)` | Remove item |
| `$.beeico.storage.session.clear()` | Clear all prefixed items |
| `$.beeico.storage.session.keys()` | Get all prefixed keys |

---

## Quick Start

### 1. LocalStorage - User Preferences

```javascript
// Save user preferences
$.beeico.storage.local.set('userPreferences', {
  theme: 'dark',
  language: 'zh-CN',
  fontSize: 14
});

// Get preferences
var prefs = $.beeico.storage.local.get('userPreferences');
console.log('Theme:', prefs.theme);
```

### 2. SessionStorage - Temporary Data

```javascript
// Save temporary form data
$.beeico.storage.session.set('draftPost', {
  title: 'My Post',
  content: 'Hello World'
});

// Get draft
var draft = $.beeico.storage.session.get('draftPost');
console.log('Draft:', draft);

// Clear when submitted
$.beeico.storage.session.remove('draftPost');
```

### 3. Cookies - Authentication (Backend Only)

```javascript
// Server sets HttpOnly cookie automatically
$.beeico.json.postJson('/api/login', {
  username: 'admin',
  password: '123456'
})
  .done(data => {
    // Cookie set by server via Set-Cookie header
    // Automatically sent with all HTTP requests
    console.log('Logged in:', data.name);
    window.location.href = '/dashboard';
  });
```

---

## Common Patterns

### 1. User Settings Management

```javascript
// Load user settings on startup
var settings = $.beeico.storage.local.get('userSettings') || {
  theme: 'light',
  language: 'en'
};

function updateSettings(newSettings) {
  $.beeico.storage.local.set('userSettings', {
    ...settings,
    ...newSettings
  });
}

// Use
updateSettings({ theme: 'dark', fontSize: 16 });
```

### 2. Shopping Cart (SessionStorage)

```javascript
// Add to cart
function addToCart(productId, quantity) {
  var cart = $.beeico.storage.session.get('shoppingCart') || [];
  cart.push({ productId, quantity, addedAt: Date.now() });
  $.beeico.storage.session.set('shoppingCart', cart);
}

// Get cart
var cart = $.beeico.storage.session.get('shoppingCart');
console.log('Cart:', cart);

// Clear cart
$.beeico.storage.session.remove('shoppingCart');
```

### 3. Remember Last View

```javascript
// Save last viewed page
$.beeico.storage.local.set('lastViewedPage', {
  url: window.location.pathname,
  timestamp: Date.now()
});

// Restore last view
var lastView = $.beeico.storage.local.get('lastViewedPage');
if (lastView) {
  console.log('Last viewed:', lastView.url);
}
```

### 4. Auto-Login (Backend Cookie + LocalStorage)

```javascript
// Login - server sets HttpOnly cookie
$.beeico.json.postJson('/api/login', credentials)
  .done(data => {
    // Store non-sensitive user data in localStorage
    $.beeico.storage.local.set('userId', data.id);
    $.beeico.storage.local.set('userName', data.name);
    $.beeico.storage.local.set('userRole', data.role);
    window.location.href = '/dashboard';
  });

// Get user data from localStorage
var userData = {
  id: $.beeico.storage.local.get('userId'),
  name: $.beeico.storage.local.get('userName'),
  role: $.beeico.storage.local.get('userRole')
};
console.log('User:', userData);

// Logout - clear localStorage, server clears cookie
$.beeico.json.postJson('/api/logout')
  .done(() => {
    $.beeico.storage.local.clear();
    window.location.href = '/login';
  });
```

---

## Advanced Usage

### 5. Storage Abstraction Layer

```javascript
// Unified storage interface
const Storage = {
  set: function(key, value, type) {
    switch (type) {
      case 'local':
        $.beeico.storage.local.set(key, value);
        break;
      case 'session':
        $.beeico.storage.session.set(key, value);
        break;
    }
  },

  get: function(key, type) {
    switch (type) {
      case 'local':
        return $.beeico.storage.local.get(key);
      case 'session':
        return $.beeico.storage.session.get(key);
      }
  },

  remove: function(key, type) {
    switch (type) {
      case 'local':
        $.beeico.storage.local.remove(key);
        break;
      case 'session':
        $.beeico.storage.session.remove(key);
        break;
    }
  }
};

// Use
Storage.set('userPreferences', { theme: 'dark' }, 'local');
var prefs = Storage.get('userPreferences', 'local');
Storage.remove('userPreferences', 'local');
```

### 6. Data Expiration

```javascript
// LocalStorage with timestamp check
function setWithExpiration(key, value, maxAgeMs) {
  $.beeico.storage.local.set(key, {
    value: value,
    timestamp: Date.now()
  });
}

function getIfValid(key, maxAgeMs) {
  var data = $.beeico.storage.local.get(key);
  if (!data) return null;
  
  var age = Date.now() - data.timestamp;
  return age < maxAgeMs ? data.value : null;
}

// Use
setWithExpiration('cache', { users: [...] }, 5 * 60 * 1000); // 5 minutes
var cache = getIfValid('cache', 5 * 60 * 1000);
```

---

## Error Handling

### 7. Storage Permission Guide

```javascript
// Check and guide user to enable storage
function initStorage(type) {
  var api = type === 'local' ? $.beeico.storage.local : $.beeico.storage.session;

  if (!api.supported()) {
    console.warn(type + ' is not supported');
    // Show guide to enable permissions
    api.enable();
    return false;
  }
  return true;
}

// Use
if (initStorage('local')) {
  $.beeico.storage.local.set('userPreferences', { theme: 'dark' });
}
```

### 8. Storage Unavailable Handling

```javascript
function safeSet(type, key, value) {
  var api = type === 'local' ? $.beeico.storage.local : $.beeico.storage.session;

  if (!api.supported()) {
    // Fallback to in-memory storage
    var fallback = {};
    fallback[key] = value;
    return false;
  }

  try {
    api.set(key, value);
    return true;
  } catch (e) {
    console.error('Storage error:', e);
    return false;
  }
}

// Use
safeSet('local', 'preferences', { theme: 'dark' });
safeSet('session', 'draft', formData);
```

### 9. Quota Exceeded

```javascript
function saveWithQuotaCheck(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
      // Show user notification
      alert('Storage is full. Please clear some data.');
      // Clear old data
      $.beeico.storage.local.clear();
      return false;
    }
    throw e;
  }
}

// Use
saveWithQuotaCheck('largeData', { /* ... */ });
```

---

## Security Best Practices

### 10. Sensitive Data Storage

```javascript
// ❌ Don't store sensitive data in localStorage
$.beeico.storage.local.set('password', 'user123');  // Risk
$.beeico.storage.local.set('creditCard', '4111...');  // Risk

// ❌ Don't store PII in localStorage
$.beeico.storage.local.set('ssn', '123-45-6789');  // Risk

// ✅ Backend sets HttpOnly cookie for authentication
// Server response header:
// Set-Cookie: auth_token=xxx; HttpOnly; Path=/; SameSite=Strict; Secure

// ✅ Minimal non-sensitive data in localStorage
$.beeico.storage.local.set('userPrefs', {
  theme: 'dark',  // Safe
  language: 'zh-CN'  // Safe
});
```

### 11. Cookie Security (Backend Only)

**Why Backend-Only Cookies?**

- **HttpOnly**: Prevents JavaScript access (XSS protection)
- **SameSite**: Prevents CSRF attacks
- **Secure**: Only sent over HTTPS
- **Automatic**: Sent with all HTTP requests, no manual handling

**Server-Side Example (Spring Boot):**

```java
// Java / Spring Boot
Cookie cookie = new Cookie("auth_token", token);
cookie.setHttpOnly(true);
cookie.setSecure(true);
cookie.setPath("/");
cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
cookie.setAttribute("SameSite", "Strict");
response.addCookie(cookie);
```

**Server-Side Example (Node.js / Express):**

```javascript
// Node.js / Express
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,      // HTTPS only
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
});
```

**Client-Side Usage:**

```javascript
// Client does NOT set cookies manually
// Cookies are automatically sent with requests

// Login - server sets HttpOnly cookie
$.beeico.json.postJson('/api/login', {
  username: 'admin',
  password: '123456'
})
  .done(data => {
    // Cookie is set by server, automatically sent in future requests
    console.log('Logged in:', data.name);
    window.location.href = '/dashboard';
  });

// Subsequent API calls - cookie automatically sent
$.beeico.json.getJson('/api/user/profile')
  .done(profile => console.log('Profile:', profile));

// Logout - server clears cookie
$.beeico.json.postJson('/api/logout')
  .done(() => {
    $.beeico.storage.local.clear(); // Clear local data only
    window.location.href = '/login';
  });
```

---

## Performance Tips

### 12. Storage Optimization

```javascript
// Batch reads
var data = {
  userPrefs: $.beeico.storage.local.get('userPrefs'),
  sessionData: $.beeico.storage.session.get('sessionData'),
  settings: $.beeico.storage.local.get('settings')
};

// Lazy writes - defer until user leaves page
$(window).on('beforeunload', function() {
  $.beeico.storage.local.set('lastPosition', {
    x: window.scrollX,
    y: window.scrollY
  });
});
```

### 13. Clear Strategy

```javascript
// Clean up old data
function cleanOldData() {
  var keys = $.beeico.storage.local.keys();
  var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  keys.forEach(key => {
    var data = $.beeico.storage.local.get(key);
    if (data && data.timestamp < weekAgo) {
      $.beeico.storage.local.remove(key);
    }
  });
}

// Run periodically
setInterval(cleanOldData, 24 * 60 * 60 * 1000); // Daily
```

---

## Comparison Table

| Feature | localStorage | sessionStorage | Cookies (Backend Only) |
|----------|-------------|--------------|------------------------|
| **Capacity** | 5-10MB | 5-10MB | ~4KB |
| **Persistence** | Permanent | Session (tab close) | Configurable |
| **Accessible** | Same origin | Same origin | Same origin |
| **Sent to server** | No | No | Yes (automatic) |
| **HttpOnly** | No | No | Yes (backend only) |
| **SameSite** | No | No | Yes (backend only) |
| **Managed by** | Frontend | Frontend | Backend |
| **Use Case** | User preferences | Temporary data | Authentication |

---

## Storage Selection Guide

### When to Use localStorage:
- User preferences (theme, language, font size)
- Application settings
- Cached data with expiration
- Offline data
- Shopping cart (if persistence needed)

### When to Use sessionStorage:
- Form drafts
- Multi-step wizard data
- Temporary session state
- Shopping cart (session-only)
- Modal/dialog state

### When to Use Cookies (Backend):
- Authentication tokens (HttpOnly)
- Session identifiers (HttpOnly)
- CSRF protection tokens
- Remember me functionality

---

## Best Practices

1. **Authentication** → Backend sets HttpOnly Cookies
2. **User Preferences** → Use localStorage
3. **Session Data** → Use sessionStorage
4. **Cache Data** → Use localStorage with expiration
5. **Avoid localStorage for** → Sensitive data (passwords, tokens, PII)
6. **Use structured data** → Always JSON.stringify/parse
7. **Handle quota exceeded** → Graceful fallback
8. **Clean up old data** → Prevent storage overflow
9. **Namespace keys** → Use prefix to avoid conflicts
10. **Test availability** → Check supported before use

---

## Integration with Beeico AJAX

```javascript
// Login flow
$.beeico.json.postJson('/api/login', { 
  username: 'admin', 
  password: '123456' 
})
  .done(data => {
    // Cookie set by server, auto-sent in future requests
    // Store additional user data in localStorage
    $.beeico.storage.local.set('userId', data.id);
    $.beeico.storage.local.set('userName', data.name);
    $.beeico.storage.local.set('userRole', data.role);
  })
  .fail(jqXHR => {
    if (jqXHR.status === 401) {
      console.error('Invalid credentials');
    }
  });

// Subsequent requests - token automatically sent
$.beeico.json.getJson('/api/users')
  .done(users => console.log(users));

// Logout
$.beeico.json.postJson('/api/logout')
  .done(() => {
    // Clear local data
    $.beeico.storage.local.clear();
    // Cookie cleared by server
    window.location.href = '/login';
  });
```

---

## License

This module is part of jQuery 4.0.0 and follows MIT license.
