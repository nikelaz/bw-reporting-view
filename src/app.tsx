import { useEffect, useState } from 'react';
import { Scale } from '@nikelaz/bw-ui';
import Card from './components/card/card.tsx';
import ColLayout from './components/col-layout/col-layout.tsx';
import SankeyChart from './components/sankey-chart';
import DoughnutChart from './components/doughnut-chart.tsx';
import { CategoryType } from './types/category-type';
import Heading from './components/heading/heading.tsx';

function App() {
  const [categoryBudgetModel, setCategoryBudgetModel] = useState(window.categoryBudgetModel);
  const [theme, setTheme] = useState(window.theme);
  const [currency, setCurrency] = useState(window.currency);

  const notifyHeight = () => {
    const wrap = document.querySelector('.wrapper');
    if (!wrap) {
      return;
    }

    const height = wrap.clientHeight;

    if (!window.ReactNativeWebView) {
      setTimeout(() => notifyHeight(), 100);
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
  };

  useEffect(() => {
    if (document.readyState === 'complete') {
      setCategoryBudgetModel(window.categoryBudgetModel);
      setTheme(window.theme);
      setCurrency(window.currency);
      notifyHeight();
    }

    const loadEventHandler = () => {
      setCategoryBudgetModel(window.categoryBudgetModel);
      setTheme(window.theme);
      setCurrency(window.currency);
      notifyHeight();
    };

    window.addEventListener('load', loadEventHandler);

    return () => {
      window.removeEventListener('load', loadEventHandler);
    }
  }, [setCategoryBudgetModel, setTheme, setCurrency]);

  const incomeCategoryBudgets = categoryBudgetModel.categoryBudgetsByType[CategoryType.INCOME];
  const nonIncomeCategoryBudgets = [
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.EXPENSE],
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.SAVINGS],
    ...categoryBudgetModel.categoryBudgetsByType[CategoryType.DEBT],
  ]

  const totalIncome = incomeCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.amount, 0);
  const totalPlanned = nonIncomeCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.amount, 0);
  const leftToBudget = totalIncome - totalPlanned;
  const leftToBudgetProgress = (totalPlanned / totalIncome) * 100;
  const actual = nonIncomeCategoryBudgets.reduce((accumulator: number, categoryBudget: CategoryBudget) => accumulator += categoryBudget.currentAmount, 0);
  const plannedVsActualProgress = (actual / totalIncome) * 100;

  return (
    <div className={`wrapper ${theme === 'dark' ? 'theme:dark' : 'theme:light'}`}>
      <ColLayout>
        <Card>
          <Scale
            topValue={totalIncome}
            topLabel="Income"
            unit={currency}
            currency={currency}
            progress={leftToBudgetProgress}
            leftValue={totalPlanned}
            leftLabel="Planned"
            rightValue={leftToBudget}
            rightLabel="Left to Budget"
          />
        </Card>
        
        <Card>
          <Scale
            topValue={totalIncome}
            topLabel="Planned"
            unit={currency}
            currency={currency}
            progress={plannedVsActualProgress}
            leftValue={actual}
            leftLabel="Actual"
            rightValue={totalIncome - actual}
            rightLabel="Current Cash"
          />
        </Card>

        <Card>
          <Heading>Flow</Heading>
          <SankeyChart categoryBudgetModel={categoryBudgetModel} currency={currency} theme={theme} />
        </Card>

        <DoughnutChart categoryBudgetModel={categoryBudgetModel} currency={currency} theme={theme} />
      </ColLayout>
    </div>
  );
};

export default App;
