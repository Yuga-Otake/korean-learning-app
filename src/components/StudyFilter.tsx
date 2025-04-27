import React, { useState } from 'react';
import { StudyFilter as StudyFilterType } from '../types';

interface StudyFilterProps {
  availableCategories: string[];
  availableLevels: string[];
  initialFilter: StudyFilterType;
  onFilterChange: (filter: StudyFilterType) => void;
}

const StudyFilter: React.FC<StudyFilterProps> = ({
  availableCategories,
  availableLevels,
  initialFilter,
  onFilterChange
}) => {
  const [filter, setFilter] = useState<StudyFilterType>(initialFilter);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filter.categories, category]
      : filter.categories.filter(c => c !== category);
      
    const newFilter = { ...filter, categories: newCategories };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...filter.levels, level]
      : filter.levels.filter(l => l !== level);
      
    const newFilter = { ...filter, levels: newLevels };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const handleSelectAll = (type: 'categories' | 'levels') => {
    const allItems = type === 'categories' ? availableCategories : availableLevels;
    const newFilter = { ...filter, [type]: [...allItems] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };
  
  const handleSelectNone = (type: 'categories' | 'levels') => {
    const newFilter = { ...filter, [type]: [] };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="study-filter">
      <div className="filter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <span>学習フィルター</span>
          <span className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </h3>
        <div className="filter-summary">
          <span>選択中: カテゴリ {filter.categories.length}/{availableCategories.length}</span>
          <span>レベル {filter.levels.length}/{availableLevels.length}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="filter-content">
          <div className="filter-section">
            <div className="filter-section-header">
              <h4>カテゴリー</h4>
              <div className="filter-actions">
                <button 
                  className="filter-button small" 
                  onClick={() => handleSelectAll('categories')}
                >
                  すべて選択
                </button>
                <button 
                  className="filter-button small" 
                  onClick={() => handleSelectNone('categories')}
                >
                  選択解除
                </button>
              </div>
            </div>
            <div className="filter-options">
              {availableCategories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filter.categories.includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-header">
              <h4>レベル</h4>
              <div className="filter-actions">
                <button 
                  className="filter-button small" 
                  onClick={() => handleSelectAll('levels')}
                >
                  すべて選択
                </button>
                <button 
                  className="filter-button small" 
                  onClick={() => handleSelectNone('levels')}
                >
                  選択解除
                </button>
              </div>
            </div>
            <div className="filter-options">
              {availableLevels.map(level => (
                <label key={level} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filter.levels.includes(level)}
                    onChange={(e) => handleLevelChange(level, e.target.checked)}
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyFilter; 