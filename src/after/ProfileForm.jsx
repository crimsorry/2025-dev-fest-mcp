// ProfileForm.jsx (React 19 Refactored)
import { useState, useEffect } from "react";
import { useActionState } from "react-dom"; // React 19: useActionState 훅 임포트
import { submitForm } from "../api";

// 폼 제출을 처리하는 비동기 액션 함수
async function updateProfile(previousState, formData) {
  const nameToSubmit = formData.get("name"); // formData에서 'name' 필드 값 가져오기
  try {
    await submitForm(nameToSubmit);
    return { success: true, name: nameToSubmit }; // 성공 시 제출된 이름 반환
  } catch (err) {
    return { success: false, error: err.message }; // 실패 시 오류 메시지 반환
  }
}

export default function ProfileForm() {
  const [name, setName] = useState(""); // 입력 필드의 현재 값을 위한 로컬 상태

  // useActionState 훅을 사용하여 폼 액션 상태 관리
  // [lastResult, actionFunction, isPending] 반환
  const [actionState, submitAction, isPending] = useActionState(updateProfile, null);

  // actionState에서 오류 메시지 추출
  const error = actionState && actionState.success === false ? actionState.error : null;
  // actionState에서 제출된 이름 추출
  const submittedName = actionState && actionState.success === true ? actionState.name : "";

  // 제출 성공 시 입력 필드 초기화
  useEffect(() => {
    if (actionState && actionState.success === true) {
      setName("");
    }
  }, [actionState]); // actionState가 변경될 때마다 실행

  return (
    // React 19: form의 action prop에 submitAction 함수 직접 연결
    <form action={submitAction} data-testid="profile-form">
      <h4>프로필 업데이트</h4>
      <input
        type="text"
        name="name" // formData.get("name")을 위해 name 속성 필수
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름 입력"
        disabled={isPending} // isPending 상태에 따라 UI 비활성화
        data-testid="profile-name-input"
        aria-label="이름 입력"
      />
      <button
        type="submit"
        disabled={isPending} // isPending 상태에 따라 버튼 비활성화
        data-testid="profile-submit-button"
        aria-busy={isPending}
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
      {error && (
        <p className="error" data-testid="profile-error-message" role="alert">
          {error}
        </p>
      )}
      {!error && submittedName && (
        <p
          className="success"
          data-testid="profile-success-message"
          role="status"
        >
          ✓ {submittedName}님의 프로필이 업데이트되었습니다!
        </p>
      )}
    </form>
  );
}
