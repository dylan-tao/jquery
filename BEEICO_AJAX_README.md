# jQuery 4.0.0 with Beeico AJAX Module

## Overview

Beeico AJAX module provides a simplified and consistent API for making HTTP requests with jQuery. It wraps the native `$.ajax()` method and offers convenient shortcuts for common scenarios.

## API Reference

### URL Query Parameters (GET/DELETE)

| Method | HTTP Method | Data Format | Response Format |
|--------|-------------|-------------|-----------------|
| `$.beeico.url.getJson()` | GET | URL Query Params | JSON |
| `$.beeico.url.getText()` | GET | URL Query Params | Text/HTML |
| `$.beeico.url.deleteJson()` | DELETE | URL Query Params | JSON |
| `$.beeico.url.deleteText()` | DELETE | URL Query Params | Text/HTML |

### Form Body (POST/PUT) - Auto-detect multipart/form-data

| Method | HTTP Method | Data Format | Response Format |
|--------|-------------|-------------|-----------------|
| `$.beeico.form.postJson()` | POST | Form-encoded | JSON |
| `$.beeico.form.postText()` | POST | Form-encoded | Text/HTML |
| `$.beeico.form.putJson()` | PUT | Form-encoded | JSON |
| `$.beeico.form.putText()` | PUT | Form-encoded | Text/HTML |

### JSON Data Methods (POST/PUT)

| Method | HTTP Method | Data Format | Response Format |
|--------|-------------|-------------|-----------------|
| `$.beeico.json.postJson()` | POST | JSON | JSON |
| `$.beeico.json.postText()` | POST | JSON | Text/HTML |
| `$.beeico.json.putJson()` | PUT | JSON | JSON |
| `$.beeico.json.putText()` | PUT | JSON | Text/HTML |

---

## Quick Start

### 1. URL 查询参数（GET/DELETE）

```javascript
// GET 请求 - 返回 JSON
$.beeico.url.getJson('/api/users', { page: 1, limit: 10 })
  .done(data => console.log(data));

// GET 请求 - 返回 HTML
$.beeico.url.getText('/api/page', { id: 'about' })
  .done(html => $('#content').html(html));

// DELETE 请求 - 返回 JSON
$.beeico.url.deleteJson('/api/users/123')
  .done(data => console.log('Deleted'));
```

### 2. Form 提交（POST/PUT）- 自动检测 multipart/form-data

```javascript
// 简单表单提交 - URL 编码
$('#login-form').on('submit', function(e) {
  e.preventDefault();
  $.beeico.form.postJson('/api/login', $(this).serialize())
    .done(data => window.location.href = '/dashboard');
});

// 文件上传 - multipart/form-data 自动检测
var formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My file');
$.beeico.form.postJson('/api/upload', formData)
  .done(data => console.log('Uploaded'));

// PUT 更新
$.beeico.form.putJson('/api/users/123', {
  name: 'Updated',
  email: 'new@example.com'
}).done(data => console.log('Updated'));
```

### 3. JSON 数据（POST/PUT）

```javascript
// RESTful 创建资源
$.beeico.json.postJson('/api/users', {
  name: 'John',
  email: 'john@example.com'
}).done(data => console.log('Created'));

// RESTful 更新资源
$.beeico.json.putJson('/api/users/123', {
  name: 'Updated Name'
}).done(data => console.log('Updated'));
```

---

## Syntax Sugar - 语法糖

### 4. 表单自动序列化

```javascript
// ❌ 原生写法
var formData = {
  username: 'john',
  password: '123456',
  remember: true
};
$.beeico.form.postJson('/api/login', formData);

// ✅ 语法糖 - 自动序列化
$('#login-form').submit(function(e) {
  e.preventDefault();
  $.beeico.form.postJson('/api/login', $(this));  // 自动 serialize()
});
```

### 5. JSON 数据自动序列化

```javascript
// ❌ 原生写法
var payload = JSON.stringify({ name: 'John', age: 30 });
$.ajax({
  url: '/api/users',
  type: 'POST',
  data: payload,
  contentType: 'application/json'
});

// ✅ 语法糖 - 自动序列化
$.beeico.json.postJson('/api/users', {
  name: 'John',
  age: 30
});  // 自动 JSON.stringify()
```

### 6. 多个请求链式调用

```javascript
// ❌ 原生写法 - 嵌套回调
$.beeico.url.getJson('/api/user', { id: 123 })
  .done(function(user) {
    $.beeico.json.postJson('/api/orders', { userId: user.id })
      .done(function(orders) {
        console.log(user, orders);
      });
  });

// ✅ 语法糖 - Promise 链式
$.beeico.url.getJson('/api/user', { id: 123 })
  .then(user => $.beeico.json.postJson('/api/orders', { userId: user.id }))
  .then(orders => console.log(user, orders))
  .catch(err => console.error(err));
```

---

## File Upload Scenarios

### 7. 单文件上传

```javascript
$('#upload-form').on('submit', function(e) {
  e.preventDefault();
  
  var formData = new FormData(this);  // 自动检测 multipart/form-data
  
  $.beeico.form.postJson('/api/upload', formData)
    .done(function(data) {
      console.log('File uploaded:', data.url);
    })
    .fail(function(jqXHR) {
      console.error('Upload failed:', jqXHR.responseJSON);
    });
});
```

### 8. 多文件上传

```javascript
var formData = new FormData();
for (var i = 0; i < files.length; i++) {
  formData.append('files[]', files[i]);  // 数组命名方式
}
formData.append('folderId', 123);

$.beeico.form.postJson('/api/batch-upload', formData)
  .done(data => console.log('Uploaded:', data.count));
```

### 9. 带额外参数的文件上传

```javascript
var formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'Product photo');
formData.append('tags', JSON.stringify(['tag1', 'tag2']));
formData.append('isPublic', 'true');

$.beeico.form.postJson('/api/upload', formData)
  .done(data => console.log('Uploaded with metadata'));
```

---

## Common Patterns

### 10. 列表分页加载

```javascript
class DataLoader {
  constructor() {
    this.page = 1;
    this.loading = false;
  }

  load() {
    if (this.loading) return;
    this.loading = true;
    
    $.beeico.url.getJson('/api/users', { page: this.page, limit: 20 })
      .done(data => this.render(data))
      .always(() => this.loading = false);
  }

  loadMore() {
    if (this.loading) return;
    this.page++;
    this.load();
  }

  render(data) {
    $('#user-list').append(data.users.map(u => `<li>${u.name}</li>`).join(''));
  }
}

// 使用
var loader = new DataLoader();
loader.load();
$('#load-more').click(() => loader.loadMore());
```

### 11. 表单验证后提交

```javascript
function validateAndSubmit(form) {
  var data = $(form).serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});

  // 简单验证
  if (!data.username || data.username.length < 3) {
    $('#error').text('用户名至少3个字符').show();
    return false;
  }

  // 提交
  $.beeico.form.postJson('/api/submit', data)
    .done(result => {
      $('#success').text('提交成功！').show();
      form.reset();
    })
    .fail(jqXHR => {
      $('#error').text(jqXHR.responseJSON?.message || '提交失败').show();
    });
}

$('#my-form').on('submit', function(e) {
  e.preventDefault();
  validateAndSubmit(this);
});
```

### 12. 搜索防抖

```javascript
// 防抖函数
function debounce(fn, delay) {
  var timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 使用
var search = debounce(function(keyword) {
  $.beeico.url.getJson('/api/search', { q: keyword })
    .done(data => renderResults(data));
}, 300);

$('#search-input').on('input', function() {
  search(this.value);
});
```

---

## Error Handling

### 13. 统一错误处理

```javascript
// 统一错误处理器
function handleApiError(jqXHR, textStatus, errorThrown) {
  var message = '';
  
  switch (jqXHR.status) {
    case 400:
      message = jqXHR.responseJSON?.message || '请求参数错误';
      break;
    case 401:
      message = '请先登录';
      window.location.href = '/login';
      return;
    case 403:
      message = '无权限访问';
      break;
    case 404:
      message = '资源不存在';
      break;
    case 500:
      message = '服务器错误，请稍后重试';
      break;
    default:
      if (textStatus === 'timeout') {
        message = '请求超时';
      } else if (textStatus === 'abort') {
        message = '请求已取消';
      } else {
        message = '网络错误，请检查连接';
      }
  }
  
  $('#notification').text(message).addClass('error');
}

// 使用
$.beeico.json.postJson('/api/action', data)
  .done(result => console.log('Success:', result))
  .fail(handleApiError)
  .always(() => $('#loading').hide());
```

### 14. 自动重试机制

```javascript
function requestWithRetry(url, data, maxRetries = 3) {
  return function(retryCount = 0) {
    return $.beeico.json.postJson(url, data)
      .fail(function(jqXHR) {
        if (retryCount < maxRetries && jqXHR.status >= 500) {
          var delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retry ${retryCount + 1} after ${delay}ms`);
          setTimeout(() => requestWithRetry(url, data)(retryCount + 1), delay);
        }
      });
  }();
}

// 使用
var createUser = requestWithRetry('/api/users', { name: 'John' });
createUser()
  .done(user => console.log('User created:', user))
  .fail(jqXHR => {
    if (jqXHR.status === 400) {
      console.error('Bad request:', jqXHR.responseJSON);
    }
  });
```

---

## Spring Boot Integration

### 15. ModelAndView 页面渲染

```javascript
// 获取 Thymeleaf 渲染的页面
$.beeico.url.getText('/page/user-profile', { id: 123 })
  .done(html => {
    $('#main-content').html(html);
    // 初始化页面脚本
    if (window.initUserProfile) {
      window.initUserProfile();
    }
  });

// 提交表单，获取渲染结果
$('#settings-form').on('submit', function(e) {
  e.preventDefault();
  $.beeico.form.postText('/page/render-settings', $(this).serialize())
    .done(html => {
      $('#settings-panel').html(html);
    });
});
```

### 16. RESTful API 完整 CRUD

```javascript
var API = {
  // 查询
  list: function(params) {
    return $.beeico.url.getJson('/api/users', params);
  },
  
  // 创建
  create: function(data) {
    return $.beeico.json.postJson('/api/users', data);
  },
  
  // 更新
  update: function(id, data) {
    return $.beeico.json.putJson(`/api/users/${id}`, data);
  },
  
  // 删除
  delete: function(id) {
    return $.beeico.url.deleteJson(`/api/users/${id}`);
  }
};

// 使用
API.list({ page: 1 }).done(data => console.log('Users:', data));
API.create({ name: 'John' }).done(user => console.log('Created:', user));
API.update(123, { name: 'Updated' }).done(user => console.log('Updated:', user));
API.delete(123).done(() => console.log('Deleted'));
```

---

## Performance Tips

### 17. 并发请求优化

```javascript
// 批量获取用户信息
var userIds = [1, 2, 3, 4, 5];

// ❌ 串行 - 慢
userIds.forEach(id => {
  $.beeico.url.getJson(`/api/users/${id}`)
    .done(user => console.log(user));
});

// ✅ 并行 - 快
$.when(
  $.beeico.url.getJson('/api/users/1'),
  $.beeico.url.getJson('/api/users/2'),
  $.beeico.url.getJson('/api/users/3'),
  $.beeico.url.getJson('/api/users/4'),
  $.beeico.url.getJson('/api/users/5')
).done(function() {
  console.log('All users loaded');
});
```

### 18. 请求取消

```javascript
var pendingRequest = null;

function searchUsers(keyword) {
  // 取消之前的请求
  if (pendingRequest) {
    pendingRequest.abort();
  }
  
  pendingRequest = $.beeico.url.getJson('/api/search', { q: keyword })
    .done(results => renderResults(results))
    .fail(jqXHR => {
      if (jqXHR.statusText !== 'abort') {
        console.error('Search failed:', jqXHR);
      }
    })
    .always(() => {
      pendingRequest = null;
    });
}

$('#search-input').on('input', function() {
  searchUsers(this.value);
});
```

---

## Best Practices

### 选择正确的 API

| 场景 | 推荐方法 | 原因 |
|------|----------|------|
| 简单查询（< 2000 字符） | `$.beeico.url.getJson()` | URL 缓存友好 |
| 复杂查询（> 2000 字符） | `$.beeico.form.postJson()` | POST 避免 URL 限制 |
| 文件上传 | `$.beeico.form.postJson()` | 自动检测 FormData |
| RESTful 创建 | `$.beeico.json.postJson()` | 标准 RESTful |
| RESTful 更新 | `$.beeico.json.putJson()` | 标准 RESTful |
| RESTful 删除 | `$.beeico.url.deleteJson()` | DELETE 用查询参数 |
| 页面渲染（ModelAndView） | `$.beeico.url.getText()` | 获取 HTML |
| 表单提交（传统页面） | `$.beeico.form.postText()` | 提交获取 HTML |

### 性能优化

1. **使用缓存**：GET 请求会被浏览器缓存
2. **防抖动**：搜索、输入框使用防抖
3. **并发请求**：独立数据可用并发请求
4. **请求取消**：新请求取消旧请求
5. **错误重试**：网络波动时自动重试

### 安全建议

1. **CSRF 防护**：表单提交添加 CSRF token
2. **输入验证**：客户端验证后再提交
3. **敏感数据**：使用 HTTPS，敏感操作用 JSON Body
4. **错误处理**：统一错误处理，避免信息泄露

---

## License

This module is part of jQuery 4.0.0 and follows MIT license.
