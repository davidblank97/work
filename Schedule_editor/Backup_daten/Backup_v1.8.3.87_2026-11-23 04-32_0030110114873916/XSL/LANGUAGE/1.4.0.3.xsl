<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="language[@localeID='en-CA']/text[@id='457']">
    <xsl:copy-of select="."/>
    <text id="458">
      <content>INVALID FILE CONTENT</content>
      <desc>The content of the file is invalid and can not be loaded.</desc>
    </text>
    <text id="459">
      <content>DYNAMICS</content>
      <desc>DO NOT TRANSLATE</desc>
    </text>
  </xsl:template> 

  <xsl:template match="language[@localeID='en-CA']/text[@id='1048599']">
    <xsl:copy-of select="."/>
    <text id="1048600">
      <content>Please select a groove depth before starting schedule selection.</content>
      <desc>A message prompting the user to select a groove depth in order to schedule selection.</desc>
    </text>
    <text id="1048601">
      <content>Please select a diameter before starting schedule selection.</content>
      <desc>A message prompting the user to select a diameter in order to schedule selection.</desc>
    </text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>