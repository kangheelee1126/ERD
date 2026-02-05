import { HardDrive } from 'lucide-react';
import FileUploader from './../../components/FileUpload/FileUploader';

const FileTestPage = () => {
  // DB에 등록한 'SAMPLE_TEST' 코드를 사용합니다. [cite: 2026-02-05]
  return (
    <div className="page-container">
      <div className="page-header-layout">
        <div className="header-left">
          <HardDrive size={20} />
          <span className="page-title">파일 업로드 컴포넌트 테스트</span>
        </div>
      </div>

      <div className="content-body">
        <div className="part-container">
          {/* refType은 DB 상세코드값, refId는 임의의 테스트 아이디를 넣습니다. [cite: 2026-02-05] */}
          <FileUploader 
            refType="SAMPLE_TEST" 
            refId="TEST_2026_0205" 
          />
        </div>
      </div>
    </div>
  );
};

export default FileTestPage;