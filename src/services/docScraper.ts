import axios from 'axios';
import * as cheerio from 'cheerio';
import { ApiEndpoint, Parameter } from '../types/ApiInterface';

export async function scrapeDocumentation(url: string): Promise<ApiEndpoint[]> {
  try {
    // 使用 cors-anywhere 代理
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
    console.log('正在请求URL:', proxyUrl);
    
    const response = await axios.get(proxyUrl);
    console.log('获取到响应');
    
    const $ = cheerio.load(response.data);
    const endpoints: ApiEndpoint[] = [];

    // 查找文档内容
    console.log('开始解析文档');

    // 首先尝试查找 POST 方法和路径
    const postMethodElement = $(':contains("POST")').filter((_, el) => $(el).text().trim() === 'POST');
    if (postMethodElement.length) {
      console.log('找到 POST 方法');
      const pathElement = postMethodElement.parent().find('a');
      const path = pathElement.text().trim();
      console.log('找到路径:', path);

      // 查找接口描述
      const title = $('h1, h2').first().text().trim();
      console.log('找到标题:', title);

      // 查找参数定义
      const parameters: Parameter[] = [];
      $('pre').each((_, element) => {
        const codeText = $(element).text();
        if (codeText.includes('interface') && codeText.includes('Body')) {
          console.log('找到参数定义');
          const lines = codeText.split('\n');
          lines.forEach(line => {
            const paramMatch = line.match(/\s*(\w+):\s*(\w+);/);
            if (paramMatch) {
              parameters.push({
                name: paramMatch[1],
                type: paramMatch[2],
                required: true,
                description: ''
              });
            }
          });
        }
      });

      // 查找重要说明
      const notes: string[] = [];
      $('.theme-admonition-info, .admonition-info, .info').each((_, element) => {
        const noteText = $(element).text().trim();
        if (noteText) {
          notes.push(noteText);
        }
      });
      console.log('找到重要说明:', notes);

      endpoints.push({
        method: 'POST',
        path,
        description: title,
        parameters,
        responses: [{
          status: 200,
          description: 'Success',
          schema: 'object'
        }],
        notes: notes.join('\n')
      });
    }

    // 如果没找到 POST 方法，尝试其他方式
    if (endpoints.length === 0) {
      console.log('尝试其他解析方式');
      $('div, section, article').each((_, element) => {
        const text = $(element).text();
        const methodMatch = text.match(/(POST|GET|PUT|DELETE)\s+([\/\w\-]+)/i);
        
        if (methodMatch) {
          console.log('找到API端点:', methodMatch[0]);
          const method = methodMatch[1].toUpperCase();
          const path = methodMatch[2];
          
          endpoints.push({
            method,
            path,
            description: $(element).closest('section').find('h1, h2').first().text().trim(),
            parameters: [],
            responses: [{
              status: 200,
              description: 'Success',
              schema: 'object'
            }]
          });
        }
      });
    }

    if (endpoints.length === 0) {
      console.log('页面内容:', $('body').text());
      throw new Error('未能识别任何API端点，请检查文档格式或提供更详细的文档URL');
    }

    console.log('解析完成，找到端点:', endpoints);
    return endpoints;
  } catch (error) {
    console.error('文档抓取失败:', error);
    if (axios.isAxiosError(error)) {
      console.error('请求详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data
      });
    }
    throw error;
  }
} 