import { useState } from 'react';
import { getEventLabel, getEventList } from '@engine/utils/eventLabelConverter';
import { Button, Text } from '@chakra-ui/react';

type EventSelectProps = {
  eventName: EventName;
  setEventType: (eventType: EventType) => void;
};

const EventSelect = (props: EventSelectProps) => {
  const { eventName, setEventType } = props;

  const [label, setLabel] = useState<EventType>('NONE');

  return (
    <>
      <Text>{eventName}</Text>
      {getEventLabel(label)}
      {getEventList(eventName).map((event) => (
        <Button
          key={`${label} ${event}`}
          onClick={() => {
            setLabel(event);
            setEventType(event);
          }}
        >
          {getEventLabel(event)}
        </Button>
      ))}
    </>
  );
};

export default EventSelect;
