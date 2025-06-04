import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from '@nikelaz/bw-sankey-charts';
import { CurrencyFormatter } from '@nikelaz/bw-shared-libraries';
import { CategoryType } from '../types/category-type';
import { ChartColorsProvider } from '../helpers/chart-colors';

Chart.register(...registerables);
Chart.register(SankeyController, Flow);

Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.size = 16;
Chart.defaults.font.weight = 'bold';

interface SankeyChartProps {
  categoryBudgetsByType: any,
  currency: string,
  theme: Theme,
  aspectRatioStr?: string,
}

const SankeyChart = (props: SankeyChartProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const incomeCategoryBudgets = props.categoryBudgetsByType[CategoryType.INCOME];
  const incomeChartSegments = incomeCategoryBudgets.flatMap((categoryBudget: CategoryBudget) => {
    if (!categoryBudget.amount) return [];
    return [{
      from: categoryBudget.category?.title,
      to: 'Income',
      flow: categoryBudget.amount,
    }];
  });
  const currencyFormatter = new CurrencyFormatter(props.currency);

  const colorsProvider = new ChartColorsProvider();
  colorsProvider.setTheme(props.theme);

  const savingsCategoryBudgets = props.categoryBudgetsByType[CategoryType.SAVINGS];
  const totalSavings = savingsCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.amount, 0);

  const expensesCategoryBudgets = props.categoryBudgetsByType[CategoryType.EXPENSE];
  const totalExpenses = expensesCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.amount, 0);

  const debtCategoryBudgets = props.categoryBudgetsByType[CategoryType.DEBT];
  const totalDebt = debtCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.amount, 0);

  const otherChartSegments: any[] = [];

  if (totalSavings) otherChartSegments.push({ from: 'Income', to: 'Savings', flow: totalSavings });
  if (totalExpenses) otherChartSegments.push({ from: 'Income', to: 'Expenses', flow: totalExpenses });
  if (totalDebt) otherChartSegments.push({ from: 'Income', to: 'Debt', flow: totalDebt }),

  incomeChartSegments.sort((x: any, y: any) => y.flow - x.flow);
  otherChartSegments.sort((x: any, y: any) => y.flow - x.flow);

  const canvasRef: any = useRef(null);
  let chart: any = null;

  useEffect(() => {
    setIsLoading(true);
    if (canvasRef.current ===  null || chart !== null) return;

    const ctx = canvasRef.current.getContext('2d');

    if (ctx === null) return;

    const colorCallback = (c: any) => {
      const index = c.dataIndex;
      if (index < incomeChartSegments.length) {
        return colorsProvider.getIncomeColor(index);
      } else {
        return colorsProvider.getOutflowColor(index);
      }
    };

    const labelRenderer = (context: any) => {
      let categoryLabel = context.raw.from;

      if (categoryLabel === 'Income') {
        categoryLabel = context.raw.to;
      }

      return `${categoryLabel}: ${currencyFormatter.format(context.raw.flow)}`;
    };

    chart = new Chart(ctx, {
      type: 'sankey',
      options: {
        responsive: true,
        aspectRatio: 1.2 / 1,
        animation: false,
        plugins: {
          tooltip: {
            yAlign: 'bottom',
            displayColors: false,
            callbacks: {
              label: labelRenderer
            },
          },
        },
      },
      data: {
        datasets: [
          {
            data: [
              ...incomeChartSegments,
              ...otherChartSegments,
            ],
            nodeWidth: -1,
            color: '#fff',
            borderWidth: 0,
            colorFrom:  colorCallback,
            colorTo: colorCallback,
          },
        ],
      },
    });


    setIsLoading(false);

    return () => {
      if (chart) chart.destroy();
      setIsLoading(true);
    };
  }, [canvasRef, incomeChartSegments, totalSavings, totalExpenses, totalDebt])

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', aspectRatio: props.aspectRatioStr || '21/8'}}>
      { isLoading ? <div>Loading</div> : null }
      <canvas ref={canvasRef} />
    </div>
  );
}

export default SankeyChart;
