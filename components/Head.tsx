import Head from 'next/head';

type HeadComponentProps = {
  title?: string;
  children?: any;
};

const HeadComponent = ({ title, children }: HeadComponentProps) => {
  let titleStr = 'Podmix';

  if (title) {
    titleStr = `${title} - ${titleStr}`;
  }

  return (
    <Head>
      <title>{titleStr}</title>
      {children}
    </Head>
  );
};

export default HeadComponent;
