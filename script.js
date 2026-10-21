/**
 * 국가보훈부 디지털 홍보관 - 대화형 스크립트 (script.js)
 * 순수 Vanilla JS로 작성되어 서버 없이 로컬 파일(file://)로 더블클릭 실행 지원
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. 네비게이션 스크롤 효과
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. 모바일 햄버거 메뉴 토글
  const menuToggle = document.getElementById('menuToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (menuToggle && mobileDrawer && closeDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    closeDrawer.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });

    // 드로어 내 링크 클릭 시 닫기
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // 3. 정책 동향 탭 전환 기능
  const tabButtons = document.querySelectorAll('.trend-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      // 기존 활성화 해제
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // 신규 탭 활성화
      button.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 4. 뉴스 카테고리 필터링 기능
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // 버튼 활성 상태 표시
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // 카드 필터링
      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. 쉬운 보훈 Q&A 아코디언 기능
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // 다른 아코디언 닫기
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      // 현재 아이템 토글
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // ==========================================================
  // 6. [신규 기능] "나는 어떤 도움을 받을 수 있을까?" 맞춤 혜택 진단기 로직
  // ==========================================================
  const benefitForm = document.getElementById('benefitForm');
  const surveyResult = document.getElementById('surveyResult');
  const resultCardsGrid = document.getElementById('resultCardsGrid');
  const resultTargetTitle = document.getElementById('resultTargetTitle');
  const btnRestartSurvey = document.getElementById('btnRestartSurvey');
  const btnDonateShortcut = document.getElementById('btnDonateShortcut');

  // 스텝 제어
  const step1 = document.getElementById('surveyStep1');
  const step2 = document.getElementById('surveyStep2');
  const step3 = document.getElementById('surveyStep3');

  const btnToStep2 = document.getElementById('btnToStep2');
  const btnBackTo1 = document.getElementById('btnBackTo1');
  const btnToStep3 = document.getElementById('btnToStep3');
  const btnBackTo2 = document.getElementById('btnBackTo2');

  const stepIndicators = document.querySelectorAll('.step-indicator-item');

  function updateStepIndicators(currentStepNumber) {
    stepIndicators.forEach((ind, idx) => {
      const stepNum = idx + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === currentStepNumber) {
        ind.classList.add('active');
      } else if (stepNum < currentStepNumber) {
        ind.classList.add('completed');
      }
    });
  }

  if (btnToStep2) {
    btnToStep2.addEventListener('click', () => {
      step1.classList.remove('active');
      step2.classList.add('active');
      updateStepIndicators(2);
    });
  }

  if (btnBackTo1) {
    btnBackTo1.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
      updateStepIndicators(1);
    });
  }

  if (btnToStep3) {
    btnToStep3.addEventListener('click', () => {
      step2.classList.remove('active');
      step3.classList.add('active');
      updateStepIndicators(3);
    });
  }

  if (btnBackTo2) {
    btnBackTo2.addEventListener('click', () => {
      step3.classList.remove('active');
      step2.classList.add('active');
      updateStepIndicators(2);
    });
  }

  // 설문 제출 시 맞춤 혜택 분석 및 렌더링
  if (benefitForm) {
    benefitForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 사용자 입력 데이터 추출
      const selectedRole = document.querySelector('input[name="targetRole"]:checked')?.value || 'veteran';
      
      const interestCheckboxes = document.querySelectorAll('input[name="interestArea"]:checked');
      const selectedInterests = Array.from(interestCheckboxes).map(cb => cb.value);

      const conditionCheckboxes = document.querySelectorAll('input[name="extraCondition"]:checked');
      const selectedConditions = Array.from(conditionCheckboxes).map(cb => cb.value);

      // 맞춤 카드 데이터 생성
      const matchedCards = generateBenefits(selectedRole, selectedInterests, selectedConditions);

      // UI 타이틀 및 버튼 변경
      const roleTitles = {
        veteran: "국가유공자 및 참전용사님을 위한 맞춤형 보훈 혜택",
        family: "유공자 유족 및 보훈가족을 위한 든든한 지원 혜택",
        military: "제대군인 및 복무 청년을 위한 사회 정착 & 취업 지원",
        citizen: "일반 국민과 미래세대가 함께 누리는 보훈문화 & 참여 혜택"
      };

      resultTargetTitle.textContent = roleTitles[selectedRole] || "국민 맞춤형 보훈 지원 혜택";

      if (selectedRole === 'citizen') {
        btnDonateShortcut.style.display = 'inline-flex';
      } else {
        btnDonateShortcut.style.display = 'none';
      }

      // 카드 목록 렌더링
      resultCardsGrid.innerHTML = '';
      matchedCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'result-benefit-card';
        cardEl.innerHTML = `
          <div class="res-card-top">
            <span class="res-icon">${card.icon}</span>
            <h4>${card.title}</h4>
            <span class="res-tag ${card.badgeClass}">${card.badge}</span>
          </div>
          <p>${card.desc}</p>
          <ul class="res-detail-list">
            ${card.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
        `;
        resultCardsGrid.appendChild(cardEl);
      });

      // 폼 숨기고 결과 보이기
      benefitForm.style.display = 'none';
      surveyResult.style.display = 'block';

      // 결과 위치로 부드럽게 스크롤
      surveyResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 다시 진단하기 버튼
  if (btnRestartSurvey) {
    btnRestartSurvey.addEventListener('click', () => {
      surveyResult.style.display = 'none';
      benefitForm.style.display = 'block';
      step3.classList.remove('active');
      step2.classList.remove('active');
      step1.classList.add('active');
      updateStepIndicators(1);
      benefitForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // 대상별 데이터 매칭 함수
  function generateBenefits(role, interests, conditions) {
    const list = [];
    const isLowIncome = conditions.includes('lowIncome');
    const isLocal = conditions.includes('localArea');
    const isOver80 = conditions.includes('ageOver80');

    if (role === 'veteran') {
      // 국가유공자 본인
      list.push({
        icon: "💰",
        title: "보훈보상금 및 참전명예수당 정기 지급",
        badge: "핵심 권리",
        badgeClass: "tag-badge-primary",
        desc: "희생과 공헌에 걸맞게 매월 보상금 및 참전명예수당(지자체 수당 포함)이 본인 계좌로 정기 지급됩니다.",
        details: [
          "2026년 보상금 5% 인상 반영",
          "무공수훈·참전명예수당 전액 비과세 지원",
          isLowIncome ? "★ 저소득 요건 충족: 매월 생활조정수당 추가 지급" : "가구 소득수준에 따른 생활조정수당 심사 가능"
        ]
      });

      list.push({
        icon: "🏥",
        title: "보훈병원 및 동네 위탁병원 진료비 감면",
        badge: isLocal ? "2026 준보훈병원 연계" : "의료 안전망",
        badgeClass: isLocal ? "tag-badge-new" : "tag-badge-success",
        desc: "전국 6개 보훈병원 60~100% 감면 및 집 근처 900여 개 지정 위탁병원에서 90% 감면 진료를 받으실 수 있습니다.",
        details: [
          isLocal ? "강원·제주권 준보훈병원 지정 진료 혜택" : "집 근처 내과·안과 등 위탁의원 90% 감면",
          isOver80 ? "만 80세 이상 치매 검사비 및 보훈재가복지서비스(가정방문 도우미) 전액 지원" : "만성질환 치료 및 틀니·보청기 보장구 보조금",
          "입원의료비 및 보훈요양원 입소 본인부담금 감면"
        ]
      });

      list.push({
        icon: "📱",
        title: "모바일 국가유공자증 & 공공시설 무료·할인",
        badge: "디지털 편의",
        badgeClass: "tag-badge-primary",
        desc: "스마트폰 모바일 유공자증 하나로 공공교통 및 문화시설을 별도 서류 없이 즉시 우대받습니다.",
        details: [
          "KTX·SRT 철도 요금 감면 및 지하철 무임승차",
          "국내선 항공권(대한항공·아시아나 등) 및 연안여객선 운임 할인",
          "국립공원, 고궁, 공영주차장 및 국공립 박물관 무료 입장"
        ]
      });

      list.push({
        icon: "🕊️",
        title: "국립묘지 안장 및 사후 최고 예우",
        badge: "영예 예우",
        badgeClass: "tag-badge-primary",
        desc: "생을 마감하시는 순간까지 국가가 정중히 모시며, 국립현충원 및 국립호국원 안장과 영구용 태극기를 헌정합니다.",
        details: [
          "국립서울/대전현충원 또는 영천·임실·이천·산청·괴산·제주호국원 안장",
          "장례 시 대통령 명의 국가유공자 근조기 전달 및 영구용 태극기 증정",
          "공설화장시설 무료 사용 증명 온라인 즉시 연계"
        ]
      });
    } else if (role === 'family') {
      // 유공자 유족 및 보훈가족
      list.push({
        icon: "👨‍👩‍👧‍👦",
        title: "보훈가족 유족보상금 & 생계지원금",
        badge: "2026 신설 제도",
        badgeClass: "tag-badge-new",
        desc: "국가를 위해 헌신한 분의 빈자리를 지켜온 배우자와 선순위 유족을 위한 맞춤형 생계 안정 급여입니다.",
        details: [
          "순직군경 및 독립유공자 선순위 유족 보상금 매월 지급",
          isLowIncome ? "★ 2026 신설: 저소득 참전유공자 배우자 생계지원금(월 15만 원) 우선 대상" : "저소득 참전유공자 배우자 생계지원금 신청 가능",
          "생존 애국지사 특별예우금 대폭 상향에 따른 유가족 생활 보장"
        ]
      });

      list.push({
        icon: "🎓",
        title: "자녀·손자녀 교육비(학비) 전액 감면 및 장학금",
        badge: "미래세대 지원",
        badgeClass: "tag-badge-success",
        desc: "유공자 본인 및 자녀, 독립유공자의 손자녀까지 초·중·고·대학교 수업료 전액 면제와 보훈장학금을 지원합니다.",
        details: [
          "국공립 및 사립 대학교 수업료(등록금) 100% 면제 혜택",
          "한국보훈복지의료공단 보훈장학금(학기당 100~200만 원)",
          "대학원 진학 시 학업 장려 장학금 신청 연계"
        ]
      });

      list.push({
        icon: "💼",
        title: "취업지원(국가유공자 가산점 5~10%) 및 직업 알선",
        badge: "취업 보호",
        badgeClass: "tag-badge-primary",
        desc: "공무원 시험, 공공기관 및 대기업 채용 시 법정 취업지원 가산점을 부여하여 안정적인 사회 진출을 돕습니다.",
        details: [
          "공무원 및 공기업 채용 전형 시 만점의 5%~10% 가산점 적용",
          "일정 규모 이상 민간기업 국가유공자 우선채용 의무제도",
          "보훈지청 취업상담사를 통한 1:1 진로 매칭"
        ]
      });

      list.push({
        icon: "🏥",
        title: "보훈병원 진료비 50~60% 감면",
        badge: "가족 의료망",
        badgeClass: "tag-badge-primary",
        desc: "선순위 유족 및 배우자의 보훈병원 이용 시 진료비 본인부담금을 대폭 감면하여 의료비 부담을 덜어드립니다.",
        details: [
          "중앙보훈병원 등 전국 보훈병원 외래/입원 진료비 감면",
          isOver80 ? "노인성 질환 요양 및 간병 상담 우선 안내" : "정기 건강검진 할인 프로그램 제공"
        ]
      });
    } else if (role === 'military') {
      // 제대군인 및 복무 청년
      list.push({
        icon: "💼",
        title: "제대군인지원센터(Vnet) 1:1 맞춤 전직 지원",
        badge: "사회 복귀",
        badgeClass: "tag-badge-success",
        desc: "전국 10개 제대군인지원센터에서 전문 상담관이 민간 일자리 매칭과 면접 코칭을 전담 지원합니다.",
        details: [
          "제대군인 전문 헤드헌팅 및 전직 상담",
          "대기업·공공기관 협력 채용박람회 및 기업 현장탐방",
          "이력서 클리닉 및 AI 모의면접 무료 제공"
        ]
      });

      list.push({
        icon: "💳",
        title: "직업교육훈련비 (최대 150만원) & 전직지원금",
        badge: "역량 개발",
        badgeClass: "tag-badge-primary",
        desc: "사회 정착을 위한 자격증 취득과 전문 직업훈련비를 국가가 실비 지원하며, 구직 기간 생계를 보장합니다.",
        details: [
          "전문 자격증/어학/IT 코딩 학원비 1인당 연 최대 150만 원 지원",
          "중기복무(5~10년) / 장기복무(10년 이상) 전직지원금 월정액 지급",
          "청년 제대군인 취업 성공 시 취업성공수당 연계"
        ]
      });

      list.push({
        icon: "🏠",
        title: "창업 자금 및 주택 구입·임차 저리 대부",
        badge: "경제적 자립",
        badgeClass: "tag-badge-primary",
        desc: "제대 후 새로운 사업을 시작하거나 내 집을 마련할 수 있도록 국민은행/농협 등 금융기관과 연계한 저금리 대출을 지원합니다.",
        details: [
          "창업자금 장기 저금리 대부 지원 (창업 컨설팅 동시 제공)",
          "아파트 특별공급 청약 자격 및 주택 전세자금 대부",
          "생애주기별 자산관리 무료 재무상담"
        ]
      });

      list.push({
        icon: "🏥",
        title: "장기복무자 보훈병원 진료 감면 & 복무 상이 심사",
        badge: "건강 보호",
        badgeClass: "tag-badge-primary",
        desc: "복무 중 부상을 입은 장병의 신속한 국가유공자·보훈보상대상자 등록을 돕고, 장기복무자 병원 감면을 제공합니다.",
        details: [
          "복무 중 발병·부상 시 '찾아가는 보훈' 입증 서류 정부 직권 조사",
          "10년 이상 장기복무 제대군인 보훈병원 진료비 50% 감면",
          "전역 후 부상 후유증에 대한 전문 심리치료(마음나눔터) 상담"
        ]
      });
    } else {
      // 일반 국민 / 학생
      list.push({
        icon: "❤️",
        title: "‘모두의 보훈 드림’ 기부 참여 & 세액공제",
        badge: "국민 참여",
        badgeClass: "tag-badge-primary",
        desc: "국가를 위해 희생하신 영웅들에게 감사의 마음을 전하는 정부 공식 기부 플랫폼입니다.",
        details: [
          "소액(1,000원~)부터 참여 가능한 일상 속 기부",
          "저소득 고령 참전유공자 생계·의료비 직접 지정 후원",
          "연말정산 시 법정기부금 100% 소득·세액공제 혜택"
        ]
      });

      list.push({
        icon: "🕊️",
        title: "독립기념관·현충시설 무료 관람 & 청소년 역사 캠프",
        badge: "체험 학습",
        badgeClass: "tag-badge-success",
        desc: "전국 독립기념관, 백범김구기념관, 전쟁기념관 등 현충시설을 무료로 이용하며 보훈 역사를 체험할 수 있습니다.",
        details: [
          "초·중·고 학생 대상 '나라사랑 청소년 역사체험 캠프' 참가비 전액 지원",
          "전국 2,000여 개 보훈사적지 스탬프 투어 및 인증서 발급",
          "보훈문화 서포터즈 및 봉사활동 시간(VMS/1365) 인정"
        ]
      });

      list.push({
        icon: "🎖️",
        title: "우리 동네 숨은 영웅 추천 (정부 발굴 청원)",
        badge: "적극 행정",
        badgeClass: "tag-badge-new",
        desc: "이웃이나 주변에 국가를 위해 헌신했으나 서훈을 받지 못한 숨은 유공자를 국민이 직접 국가에 추천할 수 있습니다.",
        details: [
          "국가보훈부 누리집 '국민참여 제안창구'를 통한 직접 제보",
          "정부 전담 조사관이 군 복무 및 참전 기록 직권 추적",
          "발굴 성공 시 국민 추천 감사패 및 서훈 수여식 초청"
        ]
      });
    }

    return list;
  }

  // 부드러운 스크롤 (앵커 태그 보정)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
