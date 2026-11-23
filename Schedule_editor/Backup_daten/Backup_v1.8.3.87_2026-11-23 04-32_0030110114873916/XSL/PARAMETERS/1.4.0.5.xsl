<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/Parameters[@localeID='en-CA']/param[@id='264461']">
    <param id="264461">
      <name>TRACK DIAMETER</name>
      <short_name/>
      <desc>The length of the of the travel axis track's diameter.</desc>
    </param>
  </xsl:template>

  <xsl:template match="/Parameters[@localeID='en-CA']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
        <param id="265013">
          <name>PIPE DIAMETER</name>
          <short_name></short_name>
          <desc>The distance measurement of the pipe's outer diameter.</desc>
        </param>
    </xsl:copy>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>