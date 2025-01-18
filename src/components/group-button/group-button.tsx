import './group-button.css';

interface GroupButtonProps extends GenericChildrenProps {
  theme: Theme;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const GroupButton = (props: GroupButtonProps) => {
  const bgColor = props.theme === 'dark' ? '#2c2c2e' : '#f2f2f7';
  const bgActiveColor = props.theme === 'dark' ? '#3a3a3c' : '#e5e5ea';
  const textColor = props.theme === 'dark' ? '#ECEDEE' : '#11181C';

  return (
    <button
      className={`GroupButton ${props.isActive && 'is-active'}`}
      onClick={props.onClick}
      style={{
        backgroundColor: props.isActive ? bgActiveColor : bgColor,
        color: textColor
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="GroupButton-icon">
        <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M352 176L217.6 336 160 272"/>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" className="GroupButton-icon GroupButton-icon--active" viewBox="0 0 512 512">
        <path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z"/>
      </svg>
      <span>{props.children}</span>
    </button>
  );
}

export default GroupButton;
