/**
 * Citation formatting utilities for academic articles
 * Supports NLM, APA, MLA, AMA, Harvard (Harv), and Vancouver citation formats
 */

// Utility to abbreviate journal names (e.g., "Respiratory research" -> "Res. Res.")
const abbreviateJournalName = (journalName) => {
  if (!journalName) return '';
  return journalName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1, 3).toLowerCase() + '.')
    .join(' ');
};

export const citationFormats = {
  NLM: ({ title, authors, year, journal, volume, issue, pages, doi, pmid, articleData, React, asNodes = false }) => {
    // NLM format: Author(s). Title. Journal. Year;Volume(Issue):Pages.
    const formatNLMAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      const formattedAuthors = authors
        .map((author) => {
          if (!author?.name) return "";
          const parts = author.name.split(' ');
          if (parts.length === 1) return parts[0];
          const lastName = parts[parts.length - 1];
          const firstNames = parts.slice(0, -1);
          const initials = firstNames.map(name => name.charAt(0).toUpperCase()).join('');
          return `${lastName} ${initials}`;
        })
        .filter(Boolean);
      
      // NLM: Up to 6 authors, then "et al."
      if (formattedAuthors.length > 6) {
        return formattedAuthors.slice(0, 6).join(", ") + ", et al";
      }
      return formattedAuthors.join(", ");
    };

    if (asNodes && React) {
      const nodes = [];
      
      if (formatNLMAuthors(authors)) {
        nodes.push(`${formatNLMAuthors(authors)}. `);
      }
      
      if (title?.name) {
        const titleText = title.name.endsWith('.') ? `${title.name} ` : `${title.name}. `;
        nodes.push(titleText);
      }
      
      if (journal?.name) {
        nodes.push(journal.name);
        nodes.push('. ');
      }
      
      if (year?.name) {
        let datePart = year.name;
        if (volume?.name) {
          datePart += `;${volume.name}`;
          if (issue?.name) {
            datePart += `(${issue.name})`;
          }
          if (pages?.name) {
            datePart += `:${pages.name}`;
          }
        }
        datePart += '.';
        nodes.push(datePart);
      }
      
      return nodes;
    } else {
      const parts = [];
      
      if (formatNLMAuthors(authors)) {
        parts.push(`${formatNLMAuthors(authors)}.`);
      }
      
      if (title?.name) {
        const titleText = title.name.endsWith('.') ? title.name : `${title.name}.`;
        parts.push(titleText);
      }
      
      if (journal?.name) {
        parts.push(`${journal.name}.`);
      }
      
      if (year?.name) {
        let datePart = year.name;
        if (volume?.name) {
          datePart += `;${volume.name}`;
          if (issue?.name) {
            datePart += `(${issue.name})`;
          }
          if (pages?.name) {
            datePart += `:${pages.name}`;
          }
        }
        datePart += '.';
        parts.push(datePart);
      }

      return parts.join(" ");
    }
  },

  APA: ({ title, authors, year, journal, volume, issue, pages, doi, articleData, React, asNodes = false }) => {
    // APA 7th edition format: Chen, K., Sun, Y., Diao, Y., Zhang, T., & Dong, W. (2018). Title. Oncology Letters, 16(1), 167-178.
    const formatAPAAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      
      const formattedAuthors = authors.map((author) => {
        if (!author?.name) return "";
        const parts = author.name.split(' ');
        if (parts.length === 1) return parts[0];
        
        const lastName = parts[parts.length - 1];
        const firstNames = parts.slice(0, -1);
        const initials = firstNames.map(name => name.charAt(0).toUpperCase() + '.').join('');
        
        return `${lastName}, ${initials}`;
      }).filter(Boolean);

      if (formattedAuthors.length === 1) {
        return formattedAuthors[0];
      } else if (formattedAuthors.length === 2) {
        return `${formattedAuthors[0]}, & ${formattedAuthors[1]}`;
      } else if (formattedAuthors.length <= 20) {
        const allButLast = formattedAuthors.slice(0, -1);
        const last = formattedAuthors[formattedAuthors.length - 1];
        return `${allButLast.join(', ')}, & ${last}`;
      } else {
        // For more than 20 authors, include first 19, then "..." then final author
        const first19 = formattedAuthors.slice(0, 19);
        const last = formattedAuthors[formattedAuthors.length - 1];
        return `${first19.join(', ')}, ... ${last}`;
      }
    };

    if (asNodes && React) {
      // Return as React nodes for display (journal and volume italicized together)
      const nodes = [];
      // Authors and year
      if (formatAPAAuthors(authors) && year?.name) {
        nodes.push(`${formatAPAAuthors(authors)} (${year.name}). `);
      } else if (formatAPAAuthors(authors)) {
        nodes.push(`${formatAPAAuthors(authors)}. `);
      }
      // Title
      if (title?.name) {
        const titleText = title.name.endsWith('.') ? `${title.name} ` : `${title.name}. `;
        nodes.push(titleText);
      }
      // Journal and volume (italicized together), then issue and pages
      if (journal?.name) {
        let journalVol = journal.name;
        if (volume?.name) {
          journalVol += `, ${volume.name}`;
        }
        nodes.push(React.createElement('i', { key: 'journalvol' }, journalVol));
        let afterJournal = '';
        if (issue?.name) {
          afterJournal += `(${issue.name})`;
        }
        if (pages?.name) {
          afterJournal += `, ${pages.name}`;
        }
        afterJournal += '.';
        nodes.push(afterJournal);
      }
      // DOI as URL
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        nodes.push(` https://doi.org/${doiValue}`);
      }
      return nodes;
    } else {
      // Return as plain string for copying
      const parts = [];
      
      // Authors and year
      if (formatAPAAuthors(authors) && year?.name) {
        parts.push(`${formatAPAAuthors(authors)} (${year.name}).`);
      } else if (formatAPAAuthors(authors)) {
        parts.push(`${formatAPAAuthors(authors)}.`);
      }
      
      // Title
      if (title?.name) {
        const titleText = title.name.endsWith('.') ? `${title.name}` : `${title.name}.`;
        parts.push(titleText);
      }
      
      // Journal, volume, issue, pages (journal plain text for copying)
      if (journal?.name) {
        let journalPart = journal.name;
        if (volume?.name) {
          journalPart += `, ${volume.name}`;
          if (issue?.name) {
            journalPart += `(${issue.name})`;
          }
          if (pages?.name) {
            journalPart += `, ${pages.name}`;
          }
        }
        journalPart += '.';
        parts.push(journalPart);
      }
      
      // DOI as URL
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        parts.push(`https://doi.org/${doiValue}`);
      }

      return parts.join(" ");
    }
  },

  MLA: ({ title, authors, year, journal, volume, issue, pages, doi, articleData, React, asNodes = false }) => {
    // MLA 9th edition format: Author(s). "Title of Article." Journal, no. Volume, no. Issue, Year, pp. Pages. DOI.
    const formatMLAAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      if (authors.length === 1) {
        const parts = authors[0].name.split(' ');
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const firstNames = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstNames}`;
      } else if (authors.length > 3) {
        // Use et al. for >3 authors (first author only)
        const firstAuthor = authors[0];
        const parts = firstAuthor.name.split(' ');
        const lastName = parts[parts.length - 1];
        const firstNames = parts.slice(0, -1).join(' ');
        return `${lastName}, ${firstNames}, et al`;
      } else {
        // List all authors for <=3
        return authors.map((author, index) => {
          const parts = author.name.split(' ');
          const lastName = parts[parts.length - 1];
          const firstNames = parts.slice(0, -1).join(' ');
          return index === 0 ? `${lastName}, ${firstNames}` : `${firstNames} ${lastName}`;
        }).join(', ');
      }
    };

    const toTitleCase = (str) => {
      const lowerWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with'];
      return str.replace(/\w\S*/g, (word, index) => {
        const lowerWord = word.toLowerCase();
        if (index === 0 || !lowerWords.includes(lowerWord)) {
          return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }
        return lowerWord;
      });
    };

    if (asNodes && React) {
      const nodes = [];
      if (formatMLAAuthors(authors)) {
        nodes.push(`${formatMLAAuthors(authors)}. `);
      }
      if (title?.name) {
        const titleText = toTitleCase(title.name);
        const titleWithQuotes = titleText.endsWith('.') ? `"${titleText}" ` : `"${titleText}." `;
        nodes.push(titleWithQuotes);
      }
      // Journal, vol., no. (italicized together)
      if (journal?.name) {
        let journalVolIssue = journal.name;
        if (volume?.name) {
          journalVolIssue += `, vol. ${volume.name}`;
        }
        if (issue?.name) {
          journalVolIssue += `, no. ${issue.name}`;
        }
        nodes.push(React.createElement('i', { key: 'journalvolissue' }, journalVolIssue));
        let afterJournal = '';
        if (year?.name) {
          afterJournal += `, ${year.name}`;
        }
        if (pages?.name) {
          afterJournal += `, pp. ${pages.name}`;
        }
        afterJournal += '.';
        nodes.push(afterJournal);
      }
      // DOI
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        nodes.push(` https://doi.org/${doiValue}`);
      }
      return nodes;
    } else {
      const parts = [];
      if (formatMLAAuthors(authors)) {
        parts.push(`${formatMLAAuthors(authors)}.`);
      }
      if (title?.name) {
        const titleText = toTitleCase(title.name);
        const titleWithQuotes = titleText.endsWith('.') ? `"${titleText}"` : `"${titleText}."`;
        parts.push(titleWithQuotes);
      }
      if (journal?.name) {
        let journalVolIssue = journal.name;
        if (volume?.name) {
          journalVolIssue += `, vol. ${volume.name}`;
        }
        if (issue?.name) {
          journalVolIssue += `, no. ${issue.name}`;
        }
        let afterJournal = '';
        if (year?.name) {
          afterJournal += `, ${year.name}`;
        }
        if (pages?.name) {
          afterJournal += `, pp. ${pages.name}`;
        }
        afterJournal += '.';
        parts.push(journalVolIssue + afterJournal);
      }
      // DOI
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        parts.push(`https://doi.org/${doiValue}`);
      }
      return parts.join(' ');
    }
  },

  AMA: ({ title, authors, year, journal, volume, issue, pages, doi, articleData, url, accessedDate, React, asNodes = false }) => {
    // AMA format: Author(s). Title. Journal. Year;Volume(Issue):Pages. doi
    const formatAMAAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      const formattedAuthors = authors
        .map((author) => {
          if (!author?.name) return "";
          const parts = author.name.split(' ');
          if (parts.length === 1) return parts[0];
          const lastName = parts[parts.length - 1];
          const firstNames = parts.slice(0, -1);
          // No periods, no spaces between initials
          const initials = firstNames.map(name => name.charAt(0).toUpperCase()).join('');
          return `${lastName} ${initials}`;
        })
        .filter(Boolean);
    // AMA: Up to 6 authors, then "et al."
    if (formattedAuthors.length > 6) {
      return formattedAuthors.slice(0, 6).join(", ") + ", et al.";
    }
    return formattedAuthors.join(", ");
  };

  // Sentence case utility
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (asNodes && React) {
    const nodes = [];
    if (formatAMAAuthors(authors)) {
      nodes.push(`${formatAMAAuthors(authors)}. `);
    }
    if (title?.name) {
      const titleText = toSentenceCase(title.name.trim().replace(/\.$/, '')) + '. ';
      nodes.push(titleText);
    }
    if (journal?.name) {
      let journalStr = journal.name + '.';
      nodes.push(React.createElement('i', { key: 'journal' }, journalStr));
      nodes.push(' ');
    }
    if (year?.name) {
      let yearPart = year.name;
      if (volume?.name) {
        yearPart += `;${volume.name}`;
        if (issue?.name) {
          yearPart += `(${issue.name})`;
        }
        if (pages?.name) {
          yearPart += `:${pages.name}`;
        }
      }
      yearPart += '.';
      nodes.push(yearPart);
    }
    if (doi?.name || articleData?.doi) {
      const doiValue = doi?.name || articleData?.doi;
      nodes.push(` doi:${doiValue}`);
    }
    return nodes;
  } else {
    const parts = [];
    if (formatAMAAuthors(authors)) {
      parts.push(`${formatAMAAuthors(authors)}.`);
    }
    if (title?.name) {
      const titleText = toSentenceCase(title.name.trim().replace(/\.$/, '')) + '.';
      parts.push(titleText);
    }
    if (journal?.name) {
      let journalStr = journal.name + '.';
      parts.push(journalStr);
    }
    if (year?.name) {
      let yearPart = year.name;
      if (volume?.name) {
        yearPart += `;${volume.name}`;
        if (issue?.name) {
          yearPart += `(${issue.name})`;
        }
        if (pages?.name) {
          yearPart += `:${pages.name}`;
        }
      }
      yearPart += '.';
      parts.push(yearPart);
    }
    if (doi?.name || articleData?.doi) {
      const doiValue = doi?.name || articleData?.doi;
      parts.push(`doi:${doiValue}`);
    } else if (url && accessedDate) {
      parts.push(`Accessed ${accessedDate}. ${url}`);
    }
    return parts.join(' ');
  }
},

  Harv: ({ title, authors, year, journal, volume, issue, pages, doi, articleData, React, asNodes = false }) => {
    // Harvard format: Author(s) (Year) 'Title', Journal, Volume(Issue), pp. Pages. doi
    const formatHarvardAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      const formattedAuthors = authors.map((author) => {
        if (!author?.name) return "";
        const parts = author.name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        // Initials with periods, no spaces between initials
        const initials = parts.slice(0, -1).map(n => n[0]?.toUpperCase() + ".").join('');
        return `${lastName}, ${initials}`;
      }).filter(Boolean);
      if (formattedAuthors.length === 1) {
        return formattedAuthors[0];
      } else if (formattedAuthors.length === 2) {
        return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
      } else {
        // Oxford comma: all but last joined with comma, then 'and' before last
        return `${formattedAuthors.slice(0, -1).join(', ')}, and ${formattedAuthors.at(-1)}`;
      }
    };

    // Sentence case utility
    const toSentenceCase = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    if (asNodes && React) {
      const nodes = [];
      const authorsStr = formatHarvardAuthors(authors);
      if (authorsStr && year?.name) {
        nodes.push(`${authorsStr} (${year.name}) `);
      } else if (authorsStr) {
        nodes.push(`${authorsStr} `);
      }
      if (title?.name) {
        const titleText = toSentenceCase(title.name.trim().replace(/\.$/, ''));
        nodes.push(`'${titleText}', `);
      }
      if (journal?.name) {
        nodes.push(React.createElement('i', { key: 'journal' }, journal.name));
        let afterJournal = '';
        // Volume italicized, issue plain in parentheses
        if (volume?.name) {
          nodes.push(', ');
          nodes.push(React.createElement('i', { key: 'vol' }, volume.name));
          if (issue?.name) {
            nodes.push(`(${issue.name})`);
          }
        }
        if (pages?.name) afterJournal += `, pp. ${pages.name}`;
        afterJournal += '.';
        nodes.push(afterJournal);
      }
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        nodes.push(` doi:${doiValue}.`);
      }
      return nodes;
    } else {
      const parts = [];
      const authorsStr = formatHarvardAuthors(authors);
      if (authorsStr && year?.name) {
        parts.push(`${authorsStr} (${year.name})`);
      } else if (authorsStr) {
        parts.push(authorsStr);
      }
      if (title?.name) {
        const titleText = toSentenceCase(title.name.trim().replace(/\.$/, ''));
        parts.push(`'${titleText}',`);
      }
      if (journal?.name) {
        let journalPart = journal.name;
        // Volume italicized, issue plain in parentheses
        if (volume?.name) {
          journalPart += `, ${volume.name}`;
          if (issue?.name) journalPart += `(${issue.name})`;
        }
        if (pages?.name) journalPart += `, pp. ${pages.name}`;
        journalPart += '.';
        parts.push(journalPart);
      }
      if (doi?.name || articleData?.doi) {
        const doiValue = doi?.name || articleData?.doi;
        parts.push(`doi:${doiValue}.`);
      }
      return parts.join(' ');
    }
  },

  Vancouver: ({ title, authors, year, journal, volume, issue, pages, doi, pmid, articleData, React, asNodes = false }) => {
    // Vancouver format: Author(s). Title. Journal. Year;Volume(Issue):Pages.
    const formatVancouverAuthors = (authors) => {
      if (!Array.isArray(authors) || authors.length === 0) return "";
      const formattedAuthors = authors
        .map((author) => {
          if (!author?.name) return "";
          const parts = author.name.split(' ');
          if (parts.length === 1) return parts[0];
          const lastName = parts[parts.length - 1];
          const firstNames = parts.slice(0, -1);
          // No punctuation, no spaces between initials
          const initials = firstNames.map(name => name.charAt(0).toUpperCase()).join('');
          return `${lastName} ${initials}`;
        })
        .filter(Boolean);
    // Vancouver: Up to 6 authors, then "et al."
    if (formattedAuthors.length > 6) {
      return formattedAuthors.slice(0, 6).join(", ") + ", et al";
    }
    return formattedAuthors.join(", ");
  };

  // Sentence case utility
  const toSentenceCase = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (asNodes && React) {
    const nodes = [];
    if (formatVancouverAuthors(authors)) {
      nodes.push(`${formatVancouverAuthors(authors)}. `);
    }
    if (title?.name) {
      const titleText = toSentenceCase(title.name.trim().replace(/\.$/, '')) + '. ';
      nodes.push(titleText);
    }
    if (journal?.name) {
      const abbrJournal = abbreviateJournalName(journal.name);
      nodes.push(React.createElement('i', { key: 'journal' }, abbrJournal));
      nodes.push('. ');
    }
    if (year?.name) {
      let yearPart = year.name;
      if (volume?.name) {
        yearPart += `;${volume.name}`;
        if (issue?.name) {
          yearPart += `(${issue.name})`;
        }
        if (pages?.name) {
          yearPart += `:${pages.name}`;
        }
      }
      yearPart += '.';
      nodes.push(yearPart);
    }
    return nodes;
  } else {
    const parts = [];
    if (formatVancouverAuthors(authors)) {
      parts.push(`${formatVancouverAuthors(authors)}.`);
    }
    if (title?.name) {
      const titleText = toSentenceCase(title.name.trim().replace(/\.$/, '')) + '.';
      parts.push(titleText);
    }
    if (journal?.name) {
      const abbrJournal = abbreviateJournalName(journal.name);
      parts.push(`${abbrJournal}.`);
    }
    if (year?.name) {
      let yearPart = year.name;
      if (volume?.name) {
        yearPart += `;${volume.name}`;
        if (issue?.name) {
          yearPart += `(${issue.name})`;
        }
        if (pages?.name) {
          yearPart += `:${pages.name}`;
        }
      }
      yearPart += '.';
      parts.push(yearPart);
    }
    return parts.join(' ');
  }
},
};

/**
 * Generate XML citation for download
 * @param {Object} articleData - Article data object
 * @returns {string} XML formatted citation
 */
export const generateXML = (articleData) => {
  const publicData = articleData?.publicData;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<citation>
  <title>${publicData?.title?.name || ''}</title>
  <authors>
    ${publicData?.authors?.map(author => `<author>${author.name}</author>`).join('\n    ') || ''}
  </authors>
  <year>${publicData?.year?.name || ''}</year>
  <journal>${publicData?.journal?.name || ''}</journal>
  <volume>${publicData?.volume?.name || ''}</volume>
  <issue>${publicData?.issue?.name || ''}</issue>
  <pages>${publicData?.pages?.name || ''}</pages>
  <doi>${articleData?.doi || ''}</doi>
  <pmid>${articleData?.pmid || ''}</pmid>
  <mhid>${articleData?.mhid || ''}</mhid>
</citation>`;
};