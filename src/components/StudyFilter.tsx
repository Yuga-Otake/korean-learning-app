import React, { useState } from 'react';
import { StudyFilter as StudyFilterType } from '../types';

interface StudyFilterProps {
  availableCategories: string[];
  availableLevels: string[];
  initialFilter: StudyFilterType;
  onFilterChange: (filter: StudyFilterType) => void;
  mistakesAvailable?: boolean; // 間違えた問題が利用可能かどうか
}

const StudyFilter: React.FC<StudyFilterProps> = ({
  availableCategories,
  availableLevels,
  initialFilter,
  onFilterChange,
  mistakesAvailable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<StudyFilterType>(initialFilter);

  const handleCategoryChange = (category: string) => {
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter(c => c !== category)
      : [...filter.categories, category];
    
    const newFilter = { ...filter, categories: newCategories };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleLevelChange = (level: string) => {
    const newLevels = filter.levels.includes(level)
      ? filter.levels.filter(l => l !== level)
      : [...filter.levels, level];
    
    const newFilter = { ...filter, levels: newLevels };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const handleMistakesOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, showMistakesOnly: event.target.checked };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  
  const selectAllCategories = () => {
    const newFilter = { ...filter, categories: [...availableCategories] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const clearAllCategories = () => {
    const newFilter = { ...filter, categories: [] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const selectAllLevels = () => {
    const newFilter = { ...filter, levels: [...availableLevels] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const clearAllLevels = () => {
    const newFilter = { ...filter, levels: [] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  // 選択された単語の数を計算
  const getSelectedWordsText = () => {
    const totalCategories = availableCategories.length;
    const totalLevels = availableLevels.length;
    const selectedCategories = filter.categories.length;
    const selectedLevels = filter.levels.length;
    
    if (selectedCategories === 0 && selectedLevels === 0) {
      return 'すべての単語';
    } else if (selectedCategories === totalCategories && selectedLevels === totalLevels) {
      return 'すべての単語';
    } else if (selectedCategories === 0) {
      return `${selectedLevels}レベルの単語`;
    } else if (selectedLevels === 0) {
      return `${selectedCategories}カテゴリの単語`;
    } else {
      return `${selectedCategories}カテゴリ、${selectedLevels}レベルの単語`;
    }
  };

  return (
    <div className="study-filter">
      <div className="filter-header" onClick={toggleFilter}>
        <h3>学習フィルター {isOpen ? '▲' : '▼'}</h3>
        <div className="selected-count">{getSelectedWordsText()}</div>
      </div>
      
      {isOpen && (
        <div className="filter-content">
          <div className="filter-section">
            <div className="filter-section-header">
              <h4>カテゴリ</h4>
              <div className="filter-actions">
                <button onClick={selectAllCategories} className="filter-action-button">全て選択</button>
                <button onClick={clearAllCategories} className="filter-action-button">クリア</button>
              </div>
            </div>
            <div className="filter-options">
              {availableCategories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filter.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <div className="filter-section-header">
              <h4>レベル</h4>
              <div className="filter-actions">
                <button onClick={selectAllLevels} className="filter-action-button">全て選択</button>
                <button onClick={clearAllLevels} className="filter-action-button">クリア</button>
              </div>
            </div>
            <div className="filter-options">
              {availableLevels.map(level => (
                <label key={level} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filter.levels.includes(level)}
                    onChange={() => handleLevelChange(level)}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>
          
          {mistakesAvailable && (
            <div className="filter-section">
              <div className="filter-section-header">
                <h4>間違えた問題</h4>
              </div>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filter.showMistakesOnly}
                    onChange={handleMistakesOnlyChange}
                  />
                  よく間違える問題のみを表示
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyFilter; 