/**
 * 韓国語単語大量生成スクリプト
 * 
 * このスクリプトは約10000単語の韓国語データを自動生成し、
 * JSONファイルとして保存します。
 */
const fs = require('fs');
const path = require('path');

// 出力ファイルのパス
const OUTPUT_PATH = path.join(__dirname, 'korean_words_data.json');

// カテゴリとレベルのリスト
const CATEGORIES = [
  '挨拶', '日常', '基本単語', '動詞', '形容詞', '数字', '時間', '場所', 
  '人間関係', '感情', '食事', '買い物', '交通', '旅行', '学校', '仕事', 
  '趣味', '健康', '天気', '色', '動物', '言語', 'ビジネス', '文化', 
  '科学', '技術', 'スポーツ', '音楽', '芸術', '自然', '政治', '経済',
  'IT', '法律', '医学', '心理', '哲学', '宗教', '歴史', '地理'
];

const LEVELS = ['初級', '中級', '上級'];

// 初級レベルの基本的な韓国語の音節
const BASIC_SYLLABLES = [
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하',
  '고', '노', '도', '로', '모', '보', '소', '오', '조', '초', '코', '토', '포', '호',
  '구', '누', '두', '루', '무', '부', '수', '우', '주', '추', '쿠', '투', '푸', '후',
  '기', '니', '디', '리', '미', '비', '시', '이', '지', '치', '키', '티', '피', '히'
];

// 中級レベルの韓国語の音節
const INTERMEDIATE_SYLLABLES = [
  '갸', '냐', '댜', '랴', '먀', '뱌', '샤', '야', '쟈', '챠', '캬', '탸', '퍄', '햐',
  '교', '뇨', '됴', '료', '묘', '뵤', '쇼', '요', '죠', '쵸', '쿄', '툐', '표', '효',
  '규', '뉴', '듀', '류', '뮤', '뷰', '슈', '유', '쥬', '츄', '큐', '튜', '퓨', '휴',
  '긔', '늬', '듸', '릐', '믜', '븨', '싀', '의', '즤', '츼', '킈', '틔', '픠', '희'
];

// 上級レベルの韓国語の音節
const ADVANCED_SYLLABLES = [
  '각', '난', '닫', '랄', '맘', '밤', '삭', '악', '잘', '찰', '칵', '탁', '팍', '학',
  '건', '넌', '던', '런', '먼', '번', '선', '언', '전', '천', '컨', '턴', '펀', '헌',
  '곰', '놈', '돔', '롬', '몸', '봄', '솜', '옴', '좀', '촘', '콤', '톰', '폼', '홈',
  '굼', '눔', '둠', '룸', '뭄', '붐', '숨', '움', '줌', '춤', '쿰', '툼', '품', '훔'
];

// 韓国語の子音・母音
const CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

// 接尾辞リスト
const SUFFIXES = ['하다', '되다', '내다', '들다', '가다', '오다', '이다', '지다', '스럽다', '적이다'];

// 単語の長さに応じた日本語の意味パターン
const MEANING_TEMPLATES = {
  1: ['○', '○する', '○な', '○の', '○へ', '○から', '○まで', '○と', '○が', '○を'],
  2: ['○○', '○○する', '○○な', '○○の', '○○へ', '○○から', '○○まで', '○○と', '○○が', '○○を'],
  3: ['○○○', '○○○する', '○○○な', '○○○の', '○○○へ', '○○○から', '○○○まで', '○○○と', '○○○が', '○○○を'],
  4: ['○○○○', '○○○○する', '○○○○な', '○○○○の', '○○○○へ', '○○○○から', '○○○○まで', '○○○○と', '○○○○が', '○○○○を']
};

// ランダムな日本語プレースホルダー
const JP_PLACEHOLDERS = [
  '山', '川', '海', '空', '星', '雨', '雪', '風', '火', '水', '地', '木', '花', '鳥', '魚', '虫', '獣', '人',
  '子', '親', '友', '家', '村', '町', '市', '国', '球', '円', '線', '面', '手', '足', '目', '耳', '口', '鼻',
  '心', '頭', '体', '命', '名', '話', '歌', '踊', '絵', '字', '文', '本', '紙', '車', '船', '電', '光', '音',
  '力', '業', '品', '物', '事', '時', '場', '所', '方', '向', '周', '角', '色', '形', '質', '度', '数', '量'
];

// ランダムな日本語の意味を生成
function generateJapaneseMeaning(length) {
  let meaning = '';
  const template = MEANING_TEMPLATES[length][Math.floor(Math.random() * MEANING_TEMPLATES[length].length)];
  
  for (let i = 0; i < template.length; i++) {
    if (template[i] === '○') {
      meaning += JP_PLACEHOLDERS[Math.floor(Math.random() * JP_PLACEHOLDERS.length)];
    } else {
      meaning += template[i];
    }
  }
  
  return meaning;
}

// ランダムな発音を生成（簡易版）
function generatePronunciation(koreanWord) {
  // 実際のアプリでは、より精密な発音変換ロジックが必要です
  // ここでは単純な変換を行います
  
  // カタカナ変換マッピング（簡易版）
  const syllableMap = {
    '가': 'カ', '나': 'ナ', '다': 'タ', '라': 'ラ', '마': 'マ', '바': 'パ', '사': 'サ', '아': 'ア', '자': 'チャ', '차': 'チャ', '카': 'カ', '타': 'タ', '파': 'パ', '하': 'ハ',
    '고': 'コ', '노': 'ノ', '도': 'ト', '로': 'ロ', '모': 'モ', '보': 'ポ', '소': 'ソ', '오': 'オ', '조': 'チョ', '초': 'チョ', '코': 'コ', '토': 'ト', '포': 'ポ', '호': 'ホ',
    '구': 'ク', '누': 'ヌ', '두': 'トゥ', '루': 'ル', '무': 'ム', '부': 'プ', '수': 'ス', '우': 'ウ', '주': 'チュ', '추': 'チュ', '쿠': 'ク', '투': 'トゥ', '푸': 'プ', '후': 'フ',
    '기': 'キ', '니': 'ニ', '디': 'ティ', '리': 'リ', '미': 'ミ', '비': 'ピ', '시': 'シ', '이': 'イ', '지': 'チ', '치': 'チ', '키': 'キ', '티': 'ティ', '피': 'ピ', '히': 'ヒ',
    '각': 'カク', '난': 'ナン', '닫': 'タッ', '랄': 'ラル', '맘': 'マム', '밤': 'パム', '삭': 'サク', '악': 'アク', '잘': 'チャル', '찰': 'チャル', '칵': 'カク', '탁': 'タク', '팍': 'パク', '학': 'ハク',
    '하다': 'ハダ', '되다': 'テダ', '내다': 'ネダ', '들다': 'トゥルダ', '가다': 'カダ', '오다': 'オダ', '이다': 'イダ', '지다': 'チダ', '스럽다': 'スロプタ', '적이다': 'チョギダ'
  };
  
  let pronunciation = '';
  let i = 0;
  
  while (i < koreanWord.length) {
    let found = false;
    
    // 3文字のシーケンスをチェック
    if (i + 3 <= koreanWord.length) {
      const threeChars = koreanWord.substring(i, i + 3);
      if (syllableMap[threeChars]) {
        pronunciation += syllableMap[threeChars];
        i += 3;
        found = true;
        continue;
      }
    }
    
    // 2文字のシーケンスをチェック
    if (i + 2 <= koreanWord.length) {
      const twoChars = koreanWord.substring(i, i + 2);
      if (syllableMap[twoChars]) {
        pronunciation += syllableMap[twoChars];
        i += 2;
        found = true;
        continue;
      }
    }
    
    // 1文字をチェック
    const oneChar = koreanWord.charAt(i);
    if (syllableMap[oneChar]) {
      pronunciation += syllableMap[oneChar];
    } else {
      // マッピングがない場合はそのまま追加
      pronunciation += oneChar;
    }
    
    i++;
  }
  
  return pronunciation;
}

// レベルに応じた音節セットを取得
function getSyllablesByLevel(level) {
  switch (level) {
    case '初級':
      return BASIC_SYLLABLES;
    case '中級':
      return [...BASIC_SYLLABLES, ...INTERMEDIATE_SYLLABLES];
    case '上級':
      return [...BASIC_SYLLABLES, ...INTERMEDIATE_SYLLABLES, ...ADVANCED_SYLLABLES];
    default:
      return BASIC_SYLLABLES;
  }
}

// ランダムな韓国語単語を生成
function generateKoreanWord(level) {
  const syllables = getSyllablesByLevel(level);
  const length = Math.floor(Math.random() * 3) + 1; // 1〜3音節
  
  let word = '';
  for (let i = 0; i < length; i++) {
    word += syllables[Math.floor(Math.random() * syllables.length)];
  }
  
  // 単語の形態によって接尾辞を追加（ランダム）
  if (Math.random() < 0.3 && level !== '初級') {
    word += SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  }
  
  return word;
}

// 大量の単語を生成
function generateWords(count) {
  const words = [];
  const existingWords = new Set();
  
  console.log(`${count}語の単語を生成します...`);
  
  let totalGenerated = 0;
  
  while (totalGenerated < count) {
    // レベルをランダムに選択（初級が多めになるように調整）
    let level;
    const r = Math.random();
    if (r < 0.5) {
      level = '初級';
    } else if (r < 0.8) {
      level = '中級';
    } else {
      level = '上級';
    }
    
    // カテゴリをランダムに選択
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    
    // 韓国語単語を生成
    const korean = generateKoreanWord(level);
    
    // 重複チェック
    if (existingWords.has(korean)) {
      continue;
    }
    
    existingWords.add(korean);
    
    // 単語の長さ（音節数）
    const wordLength = Math.min(4, Math.ceil(korean.length / 2));
    
    // 日本語の意味を生成
    const japanese = generateJapaneseMeaning(wordLength);
    
    // 発音を生成
    const pronunciation = generatePronunciation(korean);
    
    words.push({
      korean,
      japanese,
      pronunciation,
      category,
      level
    });
    
    totalGenerated++;
    
    // 進捗表示
    if (totalGenerated % 1000 === 0) {
      console.log(`${totalGenerated}語生成完了...`);
    }
  }
  
  return words;
}

// JSONにデータを保存
function saveDataToJson(words) {
  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ words }, null, 2), 'utf8');
    console.log(`${words.length}語のデータを ${OUTPUT_PATH} に保存しました`);
    return true;
  } catch (error) {
    console.error('データ保存エラー:', error);
    return false;
  }
}

// メイン処理
function main() {
  console.log('韓国語単語の大量生成を開始します...');
  
  // 10000語を生成（既存の単語数を考慮して調整可能）
  const targetCount = 10000;
  const words = generateWords(targetCount);
  
  console.log(`単語の生成が完了しました。合計: ${words.length}語`);
  
  // JSONに保存
  if (saveDataToJson(words)) {
    console.log('次のステップ: add-words.jsを実行して単語をCSVに追加してください。');
  }
}

// スクリプトを実行
main(); 