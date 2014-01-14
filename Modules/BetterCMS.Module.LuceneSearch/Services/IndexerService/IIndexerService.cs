﻿using BetterCMS.Module.LuceneSearch.Services.WebCrawlerService;

using BetterCms.Module.Search.Services;

namespace BetterCMS.Module.LuceneSearch.Services.IndexerService
{
    public interface IIndexerService : ISearchService
    {
        void AddHtmlDocument(PageData pageData);

        void Open(bool create = false);

        void Close();
    }
}