import { useState } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '../components/card/card';
import { ChartColorsProvider } from '../helpers/chart-colors';
import GroupButton from './group-button/group-button';
import { CurrencyFormatter } from '@nikelaz/bw-shared-libraries';
import LegendItem from './legend-item/legend-item';
import { CategoryType } from '../types/category-type';
import Heading from './heading/heading';

Chart.register(ArcElement, Tooltip, Legend);
Chart.overrides['doughnut'].plugins.legend.display = false;

enum Mode {
  INFLOW = 1,
  OUTFLOW,
}

const datasetDefaults = {
  borderWidth: 2,
};

interface DoughnutChartProps {
  currency: string;
  theme: Theme;
  categoryBudgetsByType: any;
}

const shouldDisplayLegendForCategoryBudget = (categoryBudgets: any[]) => {
  if (categoryBudgets.length === 0) return false;

  let total = 0;

  if (categoryBudgets.length === 1) {
    total = categoryBudgets[0].amount;
  }
  else {
    total = categoryBudgets.reduce((x, y) => {
      let xVal = x.amount ? parseFloat(x.amount) : 0;
      let yVal = y.amount ? parseFloat(y.amount) : 0;
      return xVal + yVal;
    }, 0);
  }

  if (typeof total === 'number' && total > 0) return true;
  return false;
}

export default function DoughnutChart(props: DoughnutChartProps) {
  const [mode, setMode] = useState(Mode.OUTFLOW);
  const colorsProvider = new ChartColorsProvider();
  colorsProvider.setTheme(props.theme);
  const currencyFormatter = new CurrencyFormatter(props.currency);

  const incomeCategoryBudgets = props.categoryBudgetsByType[CategoryType.INCOME];
  const incomeData = {
    labels: incomeCategoryBudgets.map((categoryBudget: CategoryBudget) => categoryBudget.category?.title),
    datasets: [
      {
        ...datasetDefaults,
        data: incomeCategoryBudgets.map((categoryBudget: CategoryBudget) => categoryBudget.amount),
        backgroundColor: incomeCategoryBudgets.map(() => colorsProvider.getIncomeColor(0)),
        borderColor: props.theme === 'dark' ? '#1c1c1e' : '#fff',
      },
    ],
  };

  const expensesCategoryBudgets = props.categoryBudgetsByType[CategoryType.EXPENSE];
  const debtCategoryBudgets = props.categoryBudgetsByType[CategoryType.DEBT];
  const savingsCategoryBudgets = props.categoryBudgetsByType[CategoryType.SAVINGS];

  const outflowCategoryBudgets = [
    ...expensesCategoryBudgets,
    ...debtCategoryBudgets,
    ...savingsCategoryBudgets
  ];

  const outflowData = {
    labels: outflowCategoryBudgets.map(categoryBudget => categoryBudget.category?.title),
    datasets: [
      {
        ...datasetDefaults,
        data: outflowCategoryBudgets.map(categoryBudget => categoryBudget.amount),
        backgroundColor: [
          ...expensesCategoryBudgets.map(() => colorsProvider.getOutflowColor(0)),
          ...debtCategoryBudgets.map(() => colorsProvider.getOutflowColor(1)),
          ...savingsCategoryBudgets.map(() => colorsProvider.getOutflowColor(2)),
        ],
        borderColor: props.theme === 'dark' ? '#1c1c1e' : '#fff',
      },
    ],
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const labelRenderer = (context: any) => {
    let label = context.dataset.label || '';

    if (label) {
      label += ': ';
    }

    if (context.parsed.y !== null) {
      label += currencyFormatter.format(parseFloat(context.raw));
    }

    return label;
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label: labelRenderer
        },
      },
    },
  };

  return (
    <>
      <Card>
        <Heading>Breakdown</Heading>
        <div className="GroupButton-wrap" style={{ marginBottom: 15 }}>
          <GroupButton
            theme={props.theme}
            isActive={mode === Mode.OUTFLOW}
            onClick={() => setMode(Mode.OUTFLOW)}
          >
            Outflow
          </GroupButton>
          <GroupButton
            theme={props.theme}
            isActive={mode === Mode.INFLOW}
            onClick={() => setMode(Mode.INFLOW)}
          >
            Inflow
          </GroupButton>
        </div>

        <div style={{ marginBottom: 15 }}>
          {mode === Mode.OUTFLOW && (
            <Doughnut data={outflowData} options={chartOptions} />
          )}
          
          {mode === Mode.INFLOW && (
            <Doughnut data={incomeData} options={chartOptions} />
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between'}}>
          {mode === Mode.OUTFLOW && (
            <>
              {shouldDisplayLegendForCategoryBudget(expensesCategoryBudgets) ? (
                <LegendItem color={colorsProvider.getOutflowColor(0)} label="Expenses" />
              ) : null }

              {shouldDisplayLegendForCategoryBudget(debtCategoryBudgets) ? (
                <LegendItem color={colorsProvider.getOutflowColor(1)} label="Debt" />
              ) : null }

              {shouldDisplayLegendForCategoryBudget(savingsCategoryBudgets) ? (
                <LegendItem color={colorsProvider.getOutflowColor(2)} label="Savings" />
              ) : null }
            </>
          )}
          
          {mode === Mode.INFLOW && (
            <>
              {shouldDisplayLegendForCategoryBudget(expensesCategoryBudgets) ? (
                <LegendItem color={colorsProvider.getIncomeColor(0)} label="Income" />
              ) : null }
            </>
          )}
        </div>
      </Card>
    </>
    
  );
}

