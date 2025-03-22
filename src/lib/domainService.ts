// Domain suggestions service

// Function to check if a domain is available (simulated)
export const checkDomainAvailability = async (domain: string): Promise<boolean> => {
    // For demonstration purposes, we'll simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Make some domains "taken" to demonstrate the feature
        const commonDomains = [
          'portfolio.com',
          'myportfolio.com',
          'johnsmith.com',
          'developer.com',
          'webdev.io',
          'webdesign.com',
          'photography.com',
          'design.io',
          'creative.me',
          'developer.io',
          'photographer.com',
          'resume.com',
          'mysite.com',
          'professional.com',
        ];
        
        // For this example, we'll say domains with these words are unavailable
        // and make some common TLDs unavailable to show realistic behavior
        const isDomainCommon = domain.includes('portfolio') || 
                             domain.includes('resume') || 
                             domain.includes('developer') ||
                             domain === 'myportfolio' ||
                             commonDomains.includes(domain.toLowerCase());
        
        // Simulate 30% of domains being available
        const randomFactor = Math.random() > 0.3;
        
        // Determine if available based on both factors
        const isAvailable = !isDomainCommon && !randomFactor;
        
        resolve(isAvailable);
      }, 1200);
    });
  };
  
  // Function to generate domain suggestions
  export const generateDomainSuggestions = (baseDomain: string): string[] => {
    // Strip any existing TLD if present
    const domainBase = baseDomain.split('.')[0];
    
    // Common prefixes and suffixes for portfolio sites
    const prefixes = ['my', 'the', 'get', 'view', 'i-am'];
    const suffixes = ['portfolio', 'folio', 'design', 'works', 'creative', 'dev', 'studio'];
    const tlds = ['.com', '.io', '.dev', '.design', '.me', '.co'];
    
    const suggestions: string[] = [];
    
    // Generate combinations
    tlds.forEach(tld => {
      // Original domain with different TLDs
      suggestions.push(`${domainBase}${tld}`);
      
      // With common suffixes
      suffixes.forEach(suffix => {
        if (!domainBase.includes(suffix)) {
          suggestions.push(`${domainBase}${suffix}${tld}`);
          suggestions.push(`${domainBase}-${suffix}${tld}`);
        }
      });
      
      // With common prefixes
      prefixes.forEach(prefix => {
        if (!domainBase.includes(prefix)) {
          suggestions.push(`${prefix}${domainBase}${tld}`);
          suggestions.push(`${prefix}-${domainBase}${tld}`);
        }
      });
    });
    
    // Filter out any duplicates and return a limited set
    return [...new Set(suggestions)].slice(0, 6);
  };
  
  // Function to check domain suggestions availability (all at once to be efficient)
  export const checkSuggestionsAvailability = async (suggestions: string[]): Promise<Record<string, boolean>> => {
    // For demonstration, we'll create a map of domain to availability
    const results: Record<string, boolean> = {};
    
    // In a real app, this would be a bulk API call
    // For our demo, we'll stagger the responses a bit to simulate network requests
    for (const domain of suggestions) {
      const isAvailable = await checkDomainAvailability(domain);
      results[domain] = isAvailable;
    }
    
    return results;
  };