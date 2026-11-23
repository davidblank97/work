<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="cal/amps">
	<metadata>
		<schema_version/>
		<config_version>1.1.0</config_version>
		<author>Liburdi Automation</author>
		<date>02/08/2021</date>
	</metadata>
	<xsl:copy-of select="."/>
  </xsl:template>
  <xsl:template match="cal/hotwire1">
	<hotwire>
		<xsl:apply-templates select="@*|node()" />
	</hotwire>
  </xsl:template>
  <xsl:template match="cal/hotwire2">
	<xsl:copy-of select="."/>
	<pilot>
		<gain timestamp="">1</gain>
		<offset>0</offset>
		<tel_gain>1</tel_gain>
		<tel_offset>0</tel_offset>
	</pilot>
  </xsl:template>
  <xsl:template match="cal/travel" />
  <xsl:template match="cal/wire" /> 

      <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>