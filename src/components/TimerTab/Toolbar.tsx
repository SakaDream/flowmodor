import { Hide, Play, Show, Stop } from '@/components/Icons';
import { Button } from '@nextui-org/button';
import useTimerStore from '@/stores/useTimerStore';
import useLog from '@/hooks/useLog';

export default function Toolbar() {
  const { showTime, isRunning, startTimer, stopTimer, toggleShowTime } =
    useTimerStore((state) => state);
  const { log } = useLog();

  return (
    <div className="flex items-center justify-center gap-5">
      <Button
        type="button"
        variant="flat"
        isIconOnly
        className="bg-secondary"
        onPress={toggleShowTime}
      >
        {showTime ? <Hide /> : <Show />}
      </Button>
      <Button
        type="button"
        variant="flat"
        isIconOnly
        className="bg-secondary"
        onPress={
          isRunning
            ? () => {
                stopTimer();
                log();
              }
            : startTimer
        }
      >
        {isRunning ? <Stop /> : <Play />}
      </Button>
    </div>
  );
}
