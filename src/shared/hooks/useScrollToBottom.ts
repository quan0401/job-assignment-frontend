import { RefObject, useEffect, useRef } from 'react';

const useScrollToBottom = (prop: unknown[]): RefObject<HTMLDivElement> => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        }
      }, 0);
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current, { childList: true, subtree: true });
    }

    return () => {
      if (scrollRef.current) {
        observer.disconnect();
      }
    };
  }, [prop]);

  return scrollRef;
};

export default useScrollToBottom;
