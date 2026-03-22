import type { HTMLAttributes } from 'react';

import classNames from 'classnames';

export const IconChat = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span {...props} className={classNames('inline-flex items-center justify-center', props.className)}>
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Medical chat bubble with cross symbol */}
        <path
          d="M19.5 3h-15C3.12 3 2 4.12 2 5.5v10C2 16.88 3.12 18 4.5 18H7v3.75c0 .45.54.67.85.35l3.75-3.75c.14-.14.33-.25.54-.26H19.5c1.38 0 2.5-1.12 2.5-2.5v-10C22 4.12 20.88 3 19.5 3z"
          fill="currentColor"
          fillOpacity="0.9"
        />

        {/* Medical cross symbol */}
        <path d="M13 8h-2v3H8v2h3v3h2v-3h3v-2h-3z" fill="white" />
      </svg>
    </span>
  );
};
