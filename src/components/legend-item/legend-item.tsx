import './legend-item.css';

interface LegendItemProps {
  color: string,
  label: string,
}

const LegendItem = (props: LegendItemProps) => (
  <div className="LegendItem">
    <div className="LegendItem-color" style={{backgroundColor: props.color}}></div>
    <div className="LegendItem-label">{props.label}</div>
  </div>
);

export default LegendItem;
