import { useMemo, useState } from 'react';
import { ScreenId } from '../data';

type Props = { goTo: (screen: ScreenId) => void };

const operatorMap: Record<string, string> = {
  '×': '*',
  '÷': '/',
  '−': '-',
  '+': '+',
};

const ACCESS_PIN = '2026';

export default function EntryPage({ goTo }: Props) {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [enteredDigits, setEnteredDigits] = useState('');

  const safeExpression = useMemo(() => expression.replace(/[×÷−+]/g, (char) => operatorMap[char] || char), [expression]);

  const onKeyPress = (key: string) => {
    if (key === '=') {
      if (enteredDigits === ACCESS_PIN) {
        goTo('home');
        return;
      }

      try {
        const result = Function(`"use strict"; return (${safeExpression || '0'})`)();
        setDisplay(String(result));
        setExpression(String(result));
      } catch {
        setDisplay('Error');
        setExpression('');
      }
      setEnteredDigits('');
      return;
    }

    const nextExpression = expression + key;
    setExpression(nextExpression);
    setDisplay(nextExpression);

    if (/^[0-9]$/.test(key)) {
      setEnteredDigits((prev) => (prev + key).slice(-4));
    } else {
      setEnteredDigits('');
    }
  };

  const clearAll = () => {
    setExpression('');
    setDisplay('0');
    setEnteredDigits('');
  };

  return (
    <>
      <section className="card hero">
        <h3>SafeVoice</h3>
        <p>
          Use this like a normal calculator. When the correct four-digit access PIN is entered and confirmed with =,
          the reporting screens open discreetly.
        </p>
      </section>
      <section className="card section-gap">
        <div className="calculator">
          <div className="display">{display}</div>
          <div className="keys">
            {['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', '0', '.', 'C', '÷', '='].map((key) => (
              <button
                key={key}
                className={`key ${['+', '−', '×', '÷', '='].includes(key) ? 'op' : ''}`}
                onClick={() => (key === 'C' ? clearAll() : onKeyPress(key))}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="muted-small">Demo access PIN: 2026</div>
        </div>
      </section>
    </>
  );
}
