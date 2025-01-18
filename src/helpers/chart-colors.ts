export const Theme = {
  LIGHT: 'light', 
  DARK: 'dark',
};

export class ChartColorsProvider {
  theme?: Theme;

  incomeColors = {
    [Theme.LIGHT]: [
      '#1379D3',
      '#1160BB',
      '#0E489E',
    ],
    [Theme.DARK]: [
      '#1379D3',
      '#1160BB',
      '#0E489E',
    ],
  };

  outflowColors = {
    [Theme.LIGHT]: [
      '#FFAF24',
      '#FF9500',
      '#FF7F0F',
    ],
    [Theme.DARK]: [
      '#FFAF24',
      '#FF9500',
      '#FF7F0F',
    ],
  };

  currentIncomeColors = this.incomeColors[Theme.LIGHT];
  currentOutflowColors = this.outflowColors[Theme.LIGHT];

  setTheme(theme: Theme) {
    this.theme = theme;
    this.currentIncomeColors = this.incomeColors[theme];
    this.currentOutflowColors = this.outflowColors[theme];
  }

  getIncomeColor(index: number) {
    return this.currentIncomeColors[index % this.currentIncomeColors.length];
  }

  getOutflowColor(index: number) {
    return this.currentOutflowColors[index % this.currentOutflowColors.length];
  }
}
