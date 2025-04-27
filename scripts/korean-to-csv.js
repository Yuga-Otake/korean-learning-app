/**
 * 韓国語単語CSV変換スクリプト
 * 
 * このスクリプトはword-generator.jsで生成したJSONデータを
 * 既存のCSVファイルにマージします。
 */
const fs = require('fs');
const path = require('path');

// ファイルパス
const JSON_PATH = path.join(__dirname, 'korean_words_data.json');
const CSV_PATH = path.join(__dirname, '../public/korean_vocabulary.csv');

// JSONデータを読み込む
function readJsonData() {
  try {
    const data = fs.readFileSync(JSON_PATH, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData.words || [];
  } catch (error) {
    console.error('JSONファイルの読み込みエラー:', error);
    return [];
  }
}

// 既存のCSVデータを読み込む
function readExistingCSV() {
  try {
    if (fs.existsSync(CSV_PATH)) {
      const data = fs.readFileSync(CSV_PATH, 'utf8');
      const lines = data.split('\n').filter(line => line.trim());
      
      // ヘッダー行を取得
      const header = lines[0];
      
      // 既存の韓国語単語を抽出
      const existingWords = new Set();
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(',');
        if (columns.length >= 1) {
          existingWords.add(columns[0]);
        }
      }
      
      return { header, existingWords, lines };
    } else {
      return {
        header: 'korean,japanese,pronunciation,category,level',
        existingWords: new Set(),
        lines: ['korean,japanese,pronunciation,category,level']
      };
    }
  } catch (error) {
    console.error('CSVファイルの読み込みエラー:', error);
    return {
      header: 'korean,japanese,pronunciation,category,level',
      existingWords: new Set(),
      lines: ['korean,japanese,pronunciation,category,level']
    };
  }
}

// 新しい単語をCSV形式に変換
function convertToCSV(words, existingWords) {
  const csvLines = [];
  let addedCount = 0;
  
  for (const word of words) {
    // 既存の単語はスキップ
    if (existingWords.has(word.korean)) {
      continue;
    }
    
    // CSV行を作成
    const line = `${word.korean},${word.japanese},${word.pronunciation},${word.category},${word.level}`;
    csvLines.push(line);
    addedCount++;
  }
  
  console.log(`${addedCount}語の新しい単語を追加します`);
  return csvLines;
}

// CSVファイルに保存
function saveToCSV(existingLines, newLines) {
  try {
    const allLines = [...existingLines, ...newLines];
    fs.writeFileSync(CSV_PATH, allLines.join('\n'), 'utf8');
    console.log(`CSVファイルを保存しました。合計: ${allLines.length}行（ヘッダー含む）`);
    return true;
  } catch (error) {
    console.error('CSVファイルの保存エラー:', error);
    return false;
  }
}

// レベル別・カテゴリ別の統計情報を表示
function printStatistics(existingLines, newLines) {
  const levels = { '初級': 0, '中級': 0, '上級': 0 };
  const categories = {};
  
  // 全行を処理（ヘッダー行を除く）
  const allLines = [...existingLines.slice(1), ...newLines];
  
  for (const line of allLines) {
    const columns = line.split(',');
    if (columns.length >= 5) {
      const category = columns[3];
      const level = columns[4];
      
      // レベル集計
      if (levels[level] !== undefined) {
        levels[level]++;
      }
      
      // カテゴリ集計
      if (categories[category] === undefined) {
        categories[category] = 0;
      }
      categories[category]++;
    }
  }
  
  console.log('\n=== 単語データ統計 ===');
  console.log(`合計単語数: ${allLines.length}語`);
  
  console.log('\n■ レベル別単語数:');
  Object.keys(levels).forEach(level => {
    console.log(`${level}: ${levels[level]}語 (${Math.round(levels[level] / allLines.length * 100)}%)`);
  });
  
  console.log('\n■ 主要カテゴリ別単語数:');
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedCategories.forEach(([category, count]) => {
    console.log(`${category}: ${count}語 (${Math.round(count / allLines.length * 100)}%)`);
  });
  
  console.log('===================');
}

// メイン処理
function main() {
  console.log('韓国語単語データの変換を開始します...');
  
  // JSONデータを読み込む
  const words = readJsonData();
  if (!words.length) {
    console.error('JSONデータが読み込めませんでした。先にword-generator.jsを実行してください。');
    return;
  }
  
  console.log(`${words.length}語の単語データを読み込みました`);
  
  // 既存のCSVデータを読み込む
  const { header, existingWords, lines } = readExistingCSV();
  console.log(`既存のCSVファイルには${lines.length - 1}語の単語があります`);
  
  // 新しい単語をCSV形式に変換
  const newLines = convertToCSV(words, existingWords);
  
  // CSVファイルに保存
  if (saveToCSV(lines, newLines)) {
    // 統計情報を表示
    printStatistics(lines, newLines);
  }
}

// スクリプトを実行
main(); 