import SnackBox from '@component/SnackBox';
import GettingStarted from '../markdown/gettingStarted.mdx';

export default function Home() {
  return (
    <>
      <SnackBox snackId="@dbtmdgns4296/demo" />
      <GettingStarted />
    </>
  );
}
