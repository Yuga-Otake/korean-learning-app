import React from 'react';

const HangulTable: React.FC = () => {
  return (
    <div className="hangul-table-container">
      <h3 className="hangul-table-title">ハングル基本音表</h3>
      
      <div className="hangul-section">
        <h4>子音（初声）</h4>
        <table className="hangul-table">
          <thead>
            <tr>
              <th>ハングル</th>
              <th>音（日本語）</th>
              <th>ローマ字</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>ㄱ</td><td>k/g</td><td>k/g</td></tr>
            <tr><td>ㄴ</td><td>n</td><td>n</td></tr>
            <tr><td>ㄷ</td><td>t/d</td><td>t/d</td></tr>
            <tr><td>ㄹ</td><td>r/l</td><td>r/l</td></tr>
            <tr><td>ㅁ</td><td>m</td><td>m</td></tr>
            <tr><td>ㅂ</td><td>p/b</td><td>p/b</td></tr>
            <tr><td>ㅅ</td><td>s</td><td>s</td></tr>
            <tr><td>ㅇ</td><td>ng/なし</td><td>ng/-</td></tr>
            <tr><td>ㅈ</td><td>j</td><td>j</td></tr>
            <tr><td>ㅊ</td><td>ch</td><td>ch</td></tr>
            <tr><td>ㅋ</td><td>k</td><td>k</td></tr>
            <tr><td>ㅌ</td><td>t</td><td>t</td></tr>
            <tr><td>ㅍ</td><td>p</td><td>p</td></tr>
            <tr><td>ㅎ</td><td>h</td><td>h</td></tr>
          </tbody>
        </table>
      </div>
      
      <div className="hangul-section">
        <h4>母音（中声）</h4>
        <table className="hangul-table">
          <thead>
            <tr>
              <th>ハングル</th>
              <th>音（日本語）</th>
              <th>ローマ字</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>ㅏ</td><td>ア</td><td>a</td></tr>
            <tr><td>ㅑ</td><td>ヤ</td><td>ya</td></tr>
            <tr><td>ㅓ</td><td>オ</td><td>eo</td></tr>
            <tr><td>ㅕ</td><td>ヨ</td><td>yeo</td></tr>
            <tr><td>ㅗ</td><td>オ</td><td>o</td></tr>
            <tr><td>ㅛ</td><td>ヨ</td><td>yo</td></tr>
            <tr><td>ㅜ</td><td>ウ</td><td>u</td></tr>
            <tr><td>ㅠ</td><td>ユ</td><td>yu</td></tr>
            <tr><td>ㅡ</td><td>ウ</td><td>eu</td></tr>
            <tr><td>ㅣ</td><td>イ</td><td>i</td></tr>
            <tr><td>ㅐ</td><td>エ</td><td>ae</td></tr>
            <tr><td>ㅒ</td><td>イェ</td><td>yae</td></tr>
            <tr><td>ㅔ</td><td>エ</td><td>e</td></tr>
            <tr><td>ㅖ</td><td>イェ</td><td>ye</td></tr>
          </tbody>
        </table>
      </div>
      
      <div className="hangul-section">
        <h4>パッチム（終声）</h4>
        <table className="hangul-table">
          <thead>
            <tr>
              <th>ハングル</th>
              <th>音（日本語）</th>
              <th>ローマ字</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>ㄱ</td><td>k</td><td>k</td></tr>
            <tr><td>ㄴ</td><td>n</td><td>n</td></tr>
            <tr><td>ㄷ</td><td>t</td><td>t</td></tr>
            <tr><td>ㄹ</td><td>l</td><td>l</td></tr>
            <tr><td>ㅁ</td><td>m</td><td>m</td></tr>
            <tr><td>ㅂ</td><td>p</td><td>p</td></tr>
            <tr><td>ㅇ</td><td>ng</td><td>ng</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HangulTable; 