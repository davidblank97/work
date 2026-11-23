<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 

  <!-- 'indent' attribute was removed to use its default value "no" meaning XSLT processor may not add additional whitespace which -->
  <xsl:output omit-xml-declaration="yes"/> 
  <xsl:preserve-space elements="*" />

  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="screen_configuration/metadata/*[last()]">
    <xsl:copy-of select="."/>
    <last_loaded/>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>