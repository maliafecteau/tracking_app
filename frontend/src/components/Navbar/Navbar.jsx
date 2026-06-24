import { Link, useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { homeImg, expensesImg, incomeImg, savingsImg, userImg, settingsImg } from "../../assets/icons"

const PawsIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 49 59" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_63_205)">
        <g filter="url(#filter1_ii_63_205)">
        <path d="M4.88141 16.6641C4.84281 16.6591 4.80544 16.6534 4.76922 16.6468C3.39714 16.4001 3.00701 14.6067 3.01098 13.2126C3.016 11.4501 3.34702 9.35415 3.94743 7.3608C4.22677 6.43339 4.66847 5.55997 5.30534 4.83022C5.67328 4.40861 5.98392 4.09256 5.98392 4.09256L5.5046 9.82438C5.5046 9.82438 5.27465 11.5951 5.65986 12.9933C5.91684 13.9261 6.62872 14.8249 6.45479 15.7767C6.3474 16.3644 5.96012 16.8042 4.88141 16.6641Z" fill="#956B4C"/>
        <path d="M17.8904 19.006C18.3682 19.0681 18.7035 18.9915 19.0076 18.8377C19.7198 18.4774 20.2286 17.7947 20.4976 17.0433C21.2783 14.8628 21.5736 11.7101 21.2234 8.81639C20.8903 7.87735 20.0788 6.57546 20.0788 6.57546L19.0565 12.2368C19.0565 12.2368 18.8253 14.0171 18.0443 15.265C17.5199 16.1028 16.5286 16.7732 16.4744 17.7601C16.4424 18.3439 16.741 18.8568 17.8904 19.006Z" fill="#956B4C"/>
        <path d="M12.2018 15.3329C11.5031 15.2422 11.3108 14.7337 11.1801 13.7497C11.0013 11.1476 11.8183 8.83601 12.5045 5.54038C12.7686 4.27155 14.0337 1.22599 14.0337 1.22599L13.9746 8.14897C13.9746 8.14897 14.2599 10.926 14.0129 12.8281C13.8894 13.7791 13.7247 15.0472 12.2018 15.3329Z" fill="#956B4C"/>
        <path d="M2.00023 28.0557C2.39677 25.0021 3.10215 22.9694 4.98597 20.9261C5.86102 19.9769 6.50801 19.4256 7.08042 19.0819C8.93432 17.9688 11.3893 18.0852 13.3321 19.0347C15.2801 19.9866 16.7962 21.6294 18.0395 23.6838C18.8933 25.0946 19.5135 26.7235 19.236 28.3491C19.1064 29.1083 18.8492 29.7868 18.514 30.3968C17.813 31.6725 16.6332 32.8241 15.195 33.0479C13.9193 33.2464 12.8115 32.3214 11.6509 31.7559C8.56856 30.2541 6.8339 31.952 5.34484 31.7587C3.60851 31.5332 1.97656 30.504 2.00023 28.0557Z" fill="#956B4C"/>
        </g>
        <g filter="url(#filter2_ii_63_205)">
        <path d="M26.5468 35.7658C26.5141 35.7445 26.483 35.7231 26.4531 35.7016C25.3234 34.8848 25.7488 33.0994 26.3563 31.8446C27.1244 30.2583 28.3308 28.5127 29.7356 26.9762C30.3891 26.2614 31.1656 25.6655 32.0558 25.2838C32.5701 25.0632 32.9869 24.9129 32.9869 24.9129L30.0717 29.8712C30.0717 29.8712 29.0973 31.3675 28.8387 32.7946C28.6662 33.7466 28.9184 34.8651 28.3493 35.6476C27.9979 36.1307 27.4583 36.3594 26.5468 35.7658Z" fill="#DAC2A7"/>
        <path d="M37.256 43.5126C37.6598 43.7755 37.9952 43.8518 38.3359 43.8449C39.1339 43.8287 39.8882 43.4338 40.4562 42.8732C42.1046 41.2462 43.7365 38.5326 44.6746 35.7728C44.7812 34.7822 44.6139 33.2573 44.6139 33.2573L41.2398 37.9168C41.2398 37.9168 40.2601 39.4212 39.0155 40.2076C38.18 40.7355 36.9961 40.9102 36.5197 41.7762C36.2379 42.2885 36.2848 42.8801 37.256 43.5126Z" fill="#DAC2A7"/>
        <path d="M33.7206 37.7381C33.1302 37.3537 33.1771 36.812 33.4857 35.8685C34.4519 33.4458 36.1897 31.7164 38.2359 29.0434C39.0237 28.0143 41.4834 25.8175 41.4834 25.8175L38.4308 32.0314C38.4308 32.0314 37.4848 34.6579 36.4381 36.2652C35.9148 37.0689 35.217 38.1404 33.7206 37.7381Z" fill="#DAC2A7"/>
        <path d="M19.0144 44.7838C20.6947 42.2035 22.2111 40.677 24.7942 39.6515C25.9941 39.1752 26.816 38.9587 27.4808 38.8969C29.634 38.6968 31.7961 39.8653 33.1358 41.5628C34.4791 43.2647 35.1338 45.4021 35.3643 47.7923C35.5226 49.4338 35.3759 51.1706 34.4215 52.5154C33.9757 53.1435 33.45 53.6436 32.8836 54.0482C31.6991 54.8942 30.1369 55.421 28.7437 54.9996C27.508 54.6259 26.9103 53.3123 26.1092 52.2998C23.9818 49.6108 21.6828 50.3896 20.4245 49.5702C18.9573 48.6148 17.9324 46.9801 19.0144 44.7838Z" fill="#DAC2A7"/>
        </g>
        </g>
        <defs>
        <filter id="filter0_d_63_205" x="0" y="0.226074" width="46.71" height="57.9219" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_63_205"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_63_205" result="shape"/>
        </filter>
        <filter id="filter1_ii_63_205" x="2" y="1.22607" width="19.3691" height="31.8491" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.443137 0 0 0 0 0.286275 0 0 0 0 0.168627 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_63_205"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_63_205" result="effect2_innerShadow_63_205"/>
        </filter>
        <filter id="filter2_ii_63_205" x="18.564" y="24.9131" width="26.146" height="30.2349" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.717647 0 0 0 0 0.615686 0 0 0 0 0.505882 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_63_205"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_63_205" result="effect2_innerShadow_63_205"/>
        </filter>
        </defs>
    </svg>

)

const ExpensesIcon = () => (
    <svg width="54" height="53" viewBox="0 0 54 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dii_152_692)">
        <path d="M15.3496 41.7319C17.3899 41.7319 19.0623 43.4034 19.0625 45.4683C19.0625 47.5087 17.39 49.1812 15.3496 49.1812C13.2848 49.181 11.6133 47.5086 11.6133 45.4683C11.6135 43.4035 13.2849 41.7321 15.3496 41.7319ZM43.0059 41.7319C45.0462 41.7319 46.7186 43.4034 46.7188 45.4683C46.7188 47.5087 45.0463 49.1812 43.0059 49.1812C40.941 49.181 39.2695 47.5086 39.2695 45.4683C39.2697 43.4035 40.9411 41.7321 43.0059 41.7319Z" fill="#DAC2A7"/>
        </g>
        <g filter="url(#filter1_dii_152_692)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M46.7189 10.4629C48.2185 10.4629 49.2018 10.9792 50.1852 12.11C51.1685 13.2409 51.3406 14.8634 51.1193 16.3359L48.7839 32.4626C48.3414 35.5625 45.6864 37.8463 42.5643 37.8463H15.7439C12.4743 37.8463 9.77016 35.3388 9.49974 32.0963L7.23807 5.29798L3.52599 4.65881C2.54266 4.48673 1.85432 3.52798 2.02641 2.54465C2.19849 1.53673 3.15724 0.872979 4.16516 1.02048L10.0283 1.90548C10.8641 2.05544 11.4787 2.74131 11.5524 3.57715L12.0195 9.08381C12.0933 9.87294 12.7324 10.4629 13.5191 10.4629H46.7189ZM31.8214 23.2438H38.631C39.6635 23.2438 40.4747 22.408 40.4747 21.4001C40.4747 20.3676 39.6635 19.5563 38.631 19.5563H31.8214C30.7889 19.5563 29.9777 20.3676 29.9777 21.4001C29.9777 22.408 30.7889 23.2438 31.8214 23.2438Z" fill="#956B4C"/>
        </g>
        <defs>
        <filter id="filter0_dii_152_692" x="9.61328" y="40.7319" width="39.1055" height="11.4492" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_692"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_692" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.733333 0 0 0 0 0.631373 0 0 0 0 0.47451 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_692"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_692" result="effect3_innerShadow_152_692"/>
        </filter>
        <filter id="filter1_dii_152_692" x="0" y="0" width="53.2051" height="40.8462" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_692"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_692" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_692"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_692" result="effect3_innerShadow_152_692"/>
        </filter>
        </defs>
    </svg>
)

const IncomeIcon = () => (
    <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dii_152_676)">
        <path d="M2 22.0605C2.11875 27.6133 2.45125 37.1109 2.49875 38.1583C2.66737 40.3979 3.52475 42.6613 4.8595 44.2573C6.71675 46.4969 9.00387 47.4968 12.1935 47.4968C16.6015 47.5205 21.4607 47.5205 26.1799 47.5205C30.918 47.5205 35.516 47.5205 39.3991 47.4968C42.5436 47.4968 44.902 46.4708 46.7355 44.2573C48.0703 42.6613 48.9276 40.3742 49.0487 38.1583C49.0962 37.2772 49.3337 26.9673 49.4762 22.0605H2Z" fill="#DAC2A7"/>
        </g>
        <g filter="url(#filter1_dii_152_676)">
        <path d="M23.957 32.2866V35.3599C23.957 36.3431 24.755 37.1411 25.7383 37.1411C26.7215 37.1411 27.5195 36.3431 27.5195 35.3599V32.2866C27.5195 31.3034 26.7215 30.5054 25.7383 30.5054C24.755 30.5054 23.957 31.3034 23.957 32.2866" fill="#926341"/>
        </g>
        <g filter="url(#filter2_dii_152_676)">
        <path d="M28.8047 0.5C32.3694 0.500219 35.2928 3.18152 35.7393 6.62988H40.4346C45.4197 6.62988 49.4765 10.6863 49.4766 15.6738V23.9053C49.4766 24.5037 49.175 25.0624 48.6787 25.3926C43.7815 28.6344 37.9671 30.7936 31.8682 31.6367C31.785 31.6486 31.7038 31.6533 31.623 31.6533C30.8181 31.6532 30.0983 31.1084 29.8965 30.3105C29.4166 28.4204 27.6999 27.0978 25.7266 27.0977C23.7269 27.0977 22.0283 28.3919 21.501 30.3203C21.2635 31.1824 20.4348 31.7339 19.5371 31.6152C13.4786 30.7698 7.68845 28.6201 2.80078 25.3926C2.29966 25.0648 2 24.5038 2 23.9053V15.6738C2.00003 10.6863 6.06607 6.62988 11.0654 6.62988H15.7373C16.1838 3.18144 19.1047 0.500063 22.6719 0.5H28.8047ZM22.6719 4.0625C21.0736 4.06256 19.7388 5.15505 19.3398 6.62988H32.1338C31.7348 5.15517 30.4005 4.0627 28.8047 4.0625H22.6719Z" fill="#926341"/>
        </g>
        <defs>
        <filter id="filter0_dii_152_676" x="0" y="21.0605" width="51.4761" height="29.46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_676"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_676" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.717647 0 0 0 0 0.615686 0 0 0 0 0.505882 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_676"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_676" result="effect3_innerShadow_152_676"/>
        </filter>
        <filter id="filter1_dii_152_676" x="22.957" y="30.0054" width="5.5625" height="8.63574" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="0.5"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_676"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_676" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_676"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_676" result="effect3_innerShadow_152_676"/>
        </filter>
        <filter id="filter2_dii_152_676" x="1" y="0" width="49.4766" height="33.1533" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="0.5"/>
        <feGaussianBlur stdDeviation="0.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_676"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_676" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_676"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_676" result="effect3_innerShadow_152_676"/>
        </filter>
        </defs>
    </svg>
)

const SavingsIcon = () => (
    <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dii_152_707)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.8999 7.38797C32.8999 12.5703 37.1071 16.7714 42.297 16.7714C42.8685 16.7686 43.4385 16.7137 44 16.6075V35.2104C44 43.0367 39.3835 47.667 31.5457 47.667H14.4748C6.61651 47.667 2 43.0367 2 35.2104V18.1646C2 10.3382 6.61651 5.66699 14.4748 5.66699H33.064C32.9537 6.234 32.8987 6.81036 32.8999 7.38797ZM28.0166 31.0924L34.6849 22.4875V22.4465C35.2558 21.6794 35.1101 20.5977 34.3566 20.0085C33.9919 19.7269 33.5285 19.6051 33.0722 19.6707C32.6159 19.7363 32.2058 19.9839 31.9355 20.3567L26.3136 27.5889L19.9121 22.5489C19.5466 22.2642 19.0816 22.1385 18.6222 22.2002C18.1628 22.2619 17.7476 22.5057 17.4704 22.8767L10.5765 31.7685C10.3341 32.0705 10.2037 32.4468 10.2071 32.8338C10.1671 33.616 10.661 34.3265 11.4089 34.5625C12.1567 34.7986 12.9699 34.5007 13.3874 33.8377L19.1529 26.3802L25.5545 31.3997C25.9186 31.6932 26.3866 31.8263 26.8509 31.7683C27.3153 31.7104 27.7361 31.4664 28.0166 31.0924Z" fill="#956B4C"/>
        </g>
        <g filter="url(#filter1_dii_152_707)">
        <circle cx="42.8333" cy="6.83333" r="5.83333" fill="#DAC2A7"/>
        </g>
        <defs>
        <filter id="filter0_dii_152_707" x="0" y="4.66699" width="46" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_707"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_707" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_707"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_707" result="effect3_innerShadow_152_707"/>
        </filter>
        <filter id="filter1_dii_152_707" x="35" y="0" width="15.6665" height="15.6665" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.075 0 0 0 0 0.115385 0 0 0 0 0.0221893 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_152_707"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_152_707" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.733333 0 0 0 0 0.631373 0 0 0 0 0.47451 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_152_707"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_152_707" result="effect3_innerShadow_152_707"/>
        </filter>
        </defs>
    </svg>
)

const UserIcon = () => (
    <svg width="59" height="57" viewBox="0 0 59 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_ii_70_1058)">
        <path d="M22.1248 4.75C15.684 4.75 10.4478 9.80875 10.4478 16.0312C10.4478 22.135 15.389 27.075 21.8298 27.2887C22.0265 27.265 22.2232 27.265 22.3707 27.2887C22.4198 27.2887 22.4444 27.2887 22.4936 27.2887C22.5182 27.2887 22.5182 27.2887 22.5428 27.2887C28.8361 27.075 33.7773 22.135 33.8019 16.0312C33.8019 9.80875 28.5657 4.75 22.1248 4.75Z" fill="#DAC2A7"/>
        </g>
        <g filter="url(#filter1_ii_70_1058)">
        <path d="M34.6134 33.6061C27.7546 29.1886 16.5692 29.1886 9.66128 33.6061C6.53919 35.6248 4.81836 38.3561 4.81836 41.2773C4.81836 44.1986 6.53919 46.9061 9.63669 48.9011C13.0784 51.1336 17.6017 52.2498 22.125 52.2498C26.6484 52.2498 31.1717 51.1336 34.6134 48.9011C37.7109 46.8823 39.4317 44.1748 39.4317 41.2298C39.4071 38.3086 37.7109 35.6011 34.6134 33.6061Z" fill="#956B4C"/>
        </g>
        <g filter="url(#filter2_ii_70_1058)">
        <path d="M49.142 17.4325C49.5353 22.04 46.1428 26.0775 41.4474 26.6237C41.4228 26.6237 41.4228 26.6237 41.3983 26.6237H41.3245C41.177 26.6237 41.0295 26.6237 40.9066 26.6712C38.522 26.79 36.3341 26.0537 34.687 24.7C37.2191 22.515 38.6695 19.2375 38.3745 15.675C38.2024 13.7512 37.5141 11.9937 36.4816 10.4975C37.4158 10.0462 38.4974 9.76124 39.6037 9.66624C44.422 9.26249 48.7241 12.73 49.142 17.4325Z" fill="#DAC2A7"/>
        </g>
        <g filter="url(#filter3_ii_70_1058)">
        <path d="M54.0588 39.4012C53.8621 41.705 52.3379 43.7 49.7813 45.0537C47.3229 46.36 44.2254 46.9775 41.1525 46.9062C42.9225 45.3625 43.955 43.4387 44.1517 41.3962C44.3975 38.4512 42.9471 35.625 40.0463 33.3687C38.3992 32.11 36.4817 31.1125 34.3921 30.3762C39.825 28.8562 46.6592 29.8775 50.8629 33.155C53.1246 34.9125 54.28 37.1212 54.0588 39.4012Z" fill="#956B4C"/>
        </g>
        <defs>
        <filter id="filter0_ii_70_1058" x="10.4478" y="4.75" width="23.354" height="22.5386" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.733333 0 0 0 0 0.631373 0 0 0 0 0.47451 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_70_1058"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_70_1058" result="effect2_innerShadow_70_1058"/>
        </filter>
        <filter id="filter1_ii_70_1058" x="4.81836" y="30.293" width="34.6133" height="21.957" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_70_1058"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_70_1058" result="effect2_innerShadow_70_1058"/>
        </filter>
        <filter id="filter2_ii_70_1058" x="34.687" y="9.63428" width="14.4858" height="17.0493" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.733333 0 0 0 0 0.631373 0 0 0 0 0.47451 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_70_1058"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.592157 0 0 0 0 0.486275 0 0 0 0 0.364706 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_70_1058" result="effect2_innerShadow_70_1058"/>
        </filter>
        <filter id="filter3_ii_70_1058" x="34.3921" y="29.6865" width="19.6934" height="17.2251" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-1" dy="-2"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.435294 0 0 0 0 0.266667 0 0 0 0 0.145098 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_70_1058"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="-0.5" dy="-1"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.270588 0 0 0 0 0.184314 0 0 0 0 0.121569 0 0 0 1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_70_1058" result="effect2_innerShadow_70_1058"/>
        </filter>
        </defs>
    </svg>
)


const navItems = [
  { id: 1, label: 'Home', path: '/home', icon: homeImg},
  { id: 2, label: 'Expenses', path: '/expenses', icon: expensesImg },
  { id: 3, label: 'Income', path: '/income', icon: incomeImg },
  { id: 4, label: 'Savings', path: '/savings', icon: savingsImg },
  { id: 5, label: 'Settings', path: '/bank', icon: settingsImg }
];

export default function Navbar() {
    const navigate = useNavigate()

    function handleLogout(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <nav className="navbar">
            {navItems.map((item) => (
                <Link key={item.id} to={item.path} title={item.label} className="nav-link">
                    <img src={item.icon}/>
                    <span className="link-text">{item.label}</span>
                </Link>
            ))}
            <button onClick={handleLogout} className="nav-link">
                <img src={userImg}/>
                <span className="link-text">Logout</span>
            </button>
        </nav>
    )
}