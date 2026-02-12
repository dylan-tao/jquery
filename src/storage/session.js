import { jQuery } from "../core.js";

const STORAGE_PREFIX = 'beeico_storage_';

// Cache supported check
let _isSupported = null;

function getKey(key) {
	return STORAGE_PREFIX + key;
}

// Initialize session namespace if not exists
jQuery.beeico.storage = jQuery.beeico.storage || {};
jQuery.beeico.storage.session = jQuery.beeico.storage.session || {};

// sessionStorage API with performance optimizations
jQuery.beeico.storage.session = {
	supported: function() {
		if (_isSupported === null) {
			_isSupported = typeof sessionStorage !== 'undefined' &&
				sessionStorage !== null &&
				(function() {
					try {
						var testKey = STORAGE_PREFIX + '__test__';
						sessionStorage.setItem(testKey, 'test');
						sessionStorage.removeItem(testKey);
						return true;
					} catch (e) {
						return false;
					}
				})();
		}
		return _isSupported;
	},

	enable: function() {
		if (this.supported()) {
			return true;
		}
		alert('请开启浏览器 sessionStorage 权限\n\n设置路径：\nChrome: 设置 > 隐私和安全 > 网站设置 > 存储\nFirefox: 选项 > 隐私与安全\nEdge: 设置 > Cookies 和网站权限 > 存储');
		return false;
	},

	set: function(key, value) {
		if (!this.supported()) return false;
		try {
			var data = JSON.stringify({
				value: value,
				timestamp: Date.now()
			});
			sessionStorage.setItem(getKey(key), data);
			return true;
		} catch (e) {
			console.error('Storage set failed:', e);
			return false;
		}
	},

	get: function(key) {
		if (!this.supported()) return null;
		try {
			var data = sessionStorage.getItem(getKey(key));
			return data ? JSON.parse(data).value : null;
		} catch (e) {
			console.error('Storage get failed:', e);
			return null;
		}
	},

	has: function(key) {
		return this.get(key) !== null;
	},

	remove: function(key) {
		if (!this.supported()) return false;
		try {
			sessionStorage.removeItem(getKey(key));
			return true;
		} catch (e) {
			console.error('Storage remove failed:', e);
			return false;
		}
	},

	clear: function() {
		if (!this.supported()) return false;
		try {
			var prefix = STORAGE_PREFIX;
			var i = sessionStorage.length;
			while (i--) {
				var key = sessionStorage.key(i);
				if (key && key.indexOf(prefix) === 0) {
					sessionStorage.removeItem(key);
				}
			}
			return true;
		} catch (e) {
			console.error('Storage clear failed:', e);
			return false;
		}
	},

	keys: function() {
		if (!this.supported()) return [];
		try {
			var keys = [];
			var prefix = STORAGE_PREFIX;
			for (var i = 0; i < sessionStorage.length; i++) {
				var key = sessionStorage.key(i);
				if (key && key.indexOf(prefix) === 0) {
					keys.push(key.substring(prefix.length));
				}
			}
			return keys;
		} catch (e) {
			console.error('Storage keys failed:', e);
			return [];
		}
	}
};

export { jQuery };
