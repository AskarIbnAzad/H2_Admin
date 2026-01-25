import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_pmid_Article } from '../../Services/authentication';
import { colorTheme } from '../../Utils/colortheme';

const PMIDFormManager = () => {
  const dispatch = useDispatch();
  const { 
    Pmid_Article_Loading,
    Pmid_Article_Data,
    Pmid_Article_Error
  } = useSelector((state) => state.userAuth);

  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(fetch_pmid_Article(query));
      setSearchTerm(query);
      setActiveTab('overview');
    }
  };

  // Helper function to check if a field exists and isn't empty
  const hasContent = (field) => {
    return field && String(field).trim() !== '';
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Search Medical Articles by PMID</h1>
      
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-grow">
            <label htmlFor="pmid-search" className="block text-sm font-medium text-gray-700 mb-1">
              PubMed ID (PMID)
            </label>
            <input
              id="pmid-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter PMID (e.g., 40345179)"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Enter a valid PubMed ID to retrieve article details</p>
          </div>
          <button
            type="submit"
            className="px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor: colorTheme.primary,
              minWidth: '120px'
            }}
            disabled={Pmid_Article_Loading}
          >
            {Pmid_Article_Loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {Pmid_Article_Loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Retrieving article data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!Pmid_Article_Loading && Pmid_Article_Error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{Pmid_Article_Error}</p>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!Pmid_Article_Loading && searchTerm && !Pmid_Article_Error && (!Pmid_Article_Data || Pmid_Article_Data.length === 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-md">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-yellow-700">No article found with PMID: <span className="font-bold">{searchTerm}</span></p>
              <p className="mt-2 text-sm text-yellow-600">Please check the PMID and try again, or search for a different article.</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {!Pmid_Article_Loading && Pmid_Article_Data && Pmid_Article_Data.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {Pmid_Article_Data.map((article, index) => (
            <div key={index}>
              {/* Article Header */}
              <div className="p-5 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{article.title || "Untitled Article"}</h2>
                
                {/* Journal and Publication Info */}
                {(hasContent(article.journalInfo?.journal?.title) || hasContent(article.pubYear)) && (
                  <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
                    {hasContent(article.journalInfo?.journal?.title) && (
                      <span className="italic">{article.journalInfo.journal.title}</span>
                    )}
                    {hasContent(article.journalInfo?.journal?.title) && hasContent(article.pubYear) && (
                      <span>•</span>
                    )}
                    {hasContent(article.pubYear) && (
                      <span>{article.pubYear}</span>
                    )}
                  </div>
                )}

                {/* Quick Info Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {hasContent(article.id) && (
                    <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                      <span className="font-medium">PMID:</span> {article.id}
                    </div>
                  )}
                  
                  {hasContent(article.doi) && (
                    <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                      <span className="font-medium">DOI:</span> {article.doi}
                    </div>
                  )}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-3 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('authors')}
                    className={`px-4 py-3 border-b-2 font-medium text-sm ${
                      activeTab === 'authors'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Authors
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-3 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Article Details
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-5">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    {/* Abstract */}
                    {hasContent(article.abstractText) && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Abstract</h3>
                        <p className="text-gray-700">{article.abstractText}</p>
                      </div>
                    )}
                    
                    {/* Keywords */}
                    {article.keywordList?.keyword && article.keywordList.keyword.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {article.keywordList.keyword.map((keyword, i) => (
                            <span 
                              key={i} 
                              className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Publication Types */}
                    {article.pubTypeList?.pubType && article.pubTypeList.pubType.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Publication Type</h3>
                        <div className="flex flex-wrap gap-2">
                          {article.pubTypeList.pubType.map((type, i) => (
                            <span 
                              key={i}
                              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Access Links */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Access Article</h3>
                      <div className="flex flex-wrap gap-3">
                        {article.fullTextUrlList?.fullTextUrl && article.fullTextUrlList.fullTextUrl.length > 0 && (
                          <a
                            href={article.fullTextUrlList.fullTextUrl[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 rounded-md text-white bg-[#004c78] hover:bg-[#004c78]"
                          >
                            View Full Text
                          </a>
                        )}
                        
                        {hasContent(article.doi) && (
                          <a
                            href={`https://doi.org/${article.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          >
                            DOI Link
                          </a>
                        )}
                        
                        {hasContent(article.id) && (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${article.id}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          >
                            PubMed
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Authors Tab */}
                {activeTab === 'authors' && (
                  <div>
                    {/* Author List */}
                    {hasContent(article.authorString) && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Authors</h3>
                        <p className="text-gray-700">{article.authorString}</p>
                      </div>
                    )}
                    
                    {/* Affiliations */}
                    {hasContent(article.affiliation) && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Affiliations</h3>
                        <p className="text-gray-700">{article.affiliation}</p>
                      </div>
                    )}
                    
                    {/* Detailed Author List */}
                    {/* {article.authorList?.author && article.authorList.author.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Author Details</h3>
                        <div className="space-y-4">
                          {article.authorList.author.map((author, i) => (
                            <div key={i} className="p-3 bg-gray-50 rounded-md">
                              <p className="font-medium">{author.firstName} {author.lastName}</p>
                              {author.initials && (
                                <p className="text-sm text-gray-600">Initials: {author.initials}</p>
                              )}
                              {author.authorAffiliationDetailsList?.authorAffiliation && 
                               author.authorAffiliationDetailsList.authorAffiliation.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <p className="font-medium">Affiliation:</p>
                                  {author.authorAffiliationDetailsList.authorAffiliation.map((aff, j) => (
                                    <p key={j} className="mt-1 ml-2">{aff.affiliation}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div>
                    {/* Journal Info */}
                    {article.journalInfo?.journal && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Journal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                          {hasContent(article.journalInfo.journal.title) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Journal</p>
                              <p className="text-gray-800">{article.journalInfo.journal.title}</p>
                            </div>
                          )}
                          
                          {hasContent(article.journalInfo.journal.isoabbreviation) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Abbreviation</p>
                              <p className="text-gray-800">{article.journalInfo.journal.isoabbreviation}</p>
                            </div>
                          )}
                          
                          {hasContent(article.journalInfo.journal.issn) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">ISSN (Print)</p>
                              <p className="text-gray-800">{article.journalInfo.journal.issn}</p>
                            </div>
                          )}
                          
                          {hasContent(article.journalInfo.journal.essn) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">ISSN (Electronic)</p>
                              <p className="text-gray-800">{article.journalInfo.journal.essn}</p>
                            </div>
                          )}
                          
                          {hasContent(article.journalInfo.volume) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Volume</p>
                              <p className="text-gray-800">{article.journalInfo.volume}</p>
                            </div>
                          )}
                          
                          {hasContent(article.journalInfo.issue) && (
                            <div>
                              <p className="text-sm font-medium text-gray-500">Issue</p>
                              <p className="text-gray-800">{article.journalInfo.issue}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Publication Dates */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Publication Dates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        {hasContent(article.pubYear) && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Publication Year</p>
                            <p className="text-gray-800">{article.pubYear}</p>
                          </div>
                        )}
                        
                        {hasContent(article.electronicPublicationDate) && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Electronic Publication Date</p>
                            <p className="text-gray-800">{formatDate(article.electronicPublicationDate)}</p>
                          </div>
                        )}
                        
                        {hasContent(article.firstPublicationDate) && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">First Publication Date</p>
                            <p className="text-gray-800">{formatDate(article.firstPublicationDate)}</p>
                          </div>
                        )}
                        
                        {hasContent(article.dateOfCreation) && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Date Created</p>
                            <p className="text-gray-800">{formatDate(article.dateOfCreation)}</p>
                          </div>
                        )}
                        
                        {hasContent(article.dateOfRevision) && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Revised</p>
                            <p className="text-gray-800">{formatDate(article.dateOfRevision)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional Metadata */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                        {[
                          { label: 'Open Access', value: article.isOpenAccess === 'Y' ? 'Yes' : 'No' },
                          { label: 'In PMC', value: article.inPMC === 'Y' ? 'Yes' : 'No' },
                          { label: 'Has PDF', value: article.hasPDF === 'Y' ? 'Yes' : 'No' },
                          { label: 'Language', value: article.language === 'eng' ? 'English' : article.language },
                          { label: 'Publication Status', value: article.publicationStatus },
                          { label: 'Citations', value: article.citedByCount?.toString() }
                        ].filter(item => hasContent(item.value)).map((item, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium text-gray-500">{item.label}</p>
                            <p className="text-gray-800">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PMIDFormManager;