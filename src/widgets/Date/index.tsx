import './style.css';
import classnames from 'classnames';
import { useDate } from '../../providers/date';

const bits = [8, 4, 2, 1];

const renderBits = (value: number) => [
  ...bits.map((bit, i) => (
    <div
      key={`tens-${bit}-${i}`}
      className={classnames('bit', {
        on: (Math.floor(value / 10) & bit) !== 0,
      })}
    />
  )),
  ...bits.map((bit, i) => (
    <div
      key={`ones-${bit}-${i}`}
      className={classnames('bit', {
        on: (value % 10 & bit) !== 0,
      })}
    />
  )),
];
export default function Date() {
  const { date } = useDate();

  if (!date) return null;

  const hour = date?.new.getHours();
  const minute = date?.new.getMinutes();
  const seconds = date?.new.getSeconds();

  console.log({ date, hour, minute, seconds });

  return (
    <div id="widget_binary-clock">
      <div className="normal-time">
        <span className="normal-time_date">{date.new.getFullYear()}-{date.new.getMonth() + 1}-{date.new.getDate()}</span>
        <span className="normal-time_time">{date.new.toTimeString().split(" ")[0]}</span>
        </div>
      <div className="binary-clock">
        <div className="column">{renderBits(hour)}</div>
        <div className="column">{renderBits(minute)}</div>
        <div className="column">{renderBits(seconds)}</div>
      </div>
    </div>
  );
}
