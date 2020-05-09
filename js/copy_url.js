$(() => {
  $('input[name="format"]:radio').change(() => {
    format();
  });

  $('#copy').on('click', () => {
    copy();
  });

  format();
});

/**
 * URLを指定された形式に整形する
 */
function format() {
  chrome.windows.getCurrent((window) => {
    chrome.tabs.getSelected(window.id, (tab) => {
      switch ($('input[name="format"]:checked').val()) {
        case 'markdown':
          $('#format_url').val(formatMarkdown(tab.title, tab.url));
          break;

        case 'plaintext':
          $('#format_url').val(formatPlainText(tab.title, tab.url));
          break;
      }

      copy();
    });
  });
}

/**
 * クリップボードにコピーする
 */
function copy() {
  // テキストエリアを選択状態にする
  $('#format_url').focus().select();

  // クリップボードにコピー
  document.execCommand('Copy'); 
}

/**
 * @param {string} str
 * @see http://php.net/manual/ja/function.htmlspecialchars-decode.php
 */
function htmlspecialchars_decode(str) {
  const DECODE_MAP = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&',
  };

  Object.entries(DECODE_MAP).forEach(([key, value]) => {
    str = str.replace(new RegExp(key, 'g'), value);
  });

  return str;
}

/**
 * URLをMarkdown形式に整形する
 * @param {string} title 
 * @param {string} url 
 * @returns {string}
 */
function formatMarkdown(title, url) {
  return `[${ htmlspecialchars_decode(title) }](${ url })`;
}

/**
 * URLをテキスト形式に整形する
 * @param {string} title 
 * @param {string} url 
 * @returns {string}
 */
function formatPlainText(title, url) {
  return `${ htmlspecialchars_decode(title) }\n${ url }`;
}