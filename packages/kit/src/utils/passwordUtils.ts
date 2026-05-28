import backgroundApiProxy from '../background/instance/backgroundApiProxy';

export const withPromptPasswordVerify = async <T>({  
  run,  
  options,  
}: {  
  run: () => Promise<T>;  
  options?: { timeout?: number };  
}): Promise<T> => {  
  console.log('[withPromptPasswordVerify] 开始密码验证会话');  
  try {  
    await backgroundApiProxy.servicePassword.openPasswordSecuritySession(  
      options,  
    );  
    console.log('[withPromptPasswordVerify] 密码验证会话已打开，执行run函数');  
    const result = await run();  
    console.log('[withPromptPasswordVerify] run函数执行完成');  
    return result;  
  } finally {  
    console.log('[withPromptPasswordVerify] 关闭密码验证会话');  
    await backgroundApiProxy.servicePassword.closePasswordSecuritySession();  
  }  
};
