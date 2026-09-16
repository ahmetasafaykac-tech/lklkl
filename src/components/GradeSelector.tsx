import React from 'react';
import { GradeLevel, ThemeColor } from '../types';
import { GradeSelectDropdown } from './GradeSelectDropdown';

interface GradeSelectorProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  theme: ThemeColor;
  compact?: boolean;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  currentGrade,
  onSelectGrade,
  theme,
  compact = false,
}) => {
  return (
    <GradeSelectDropdown
      currentGrade={currentGrade}
      onSelectGrade={onSelectGrade}
      theme={theme}
      variant={compact ? 'compact' : 'header'}
    />
  );
};
