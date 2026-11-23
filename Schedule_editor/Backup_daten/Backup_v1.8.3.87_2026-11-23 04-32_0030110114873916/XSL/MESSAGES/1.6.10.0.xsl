<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='SCH']/str[@id='9']">
		<str id="9">
			<text>Restart weld at segment %1, from stopped travel position %2 and with %3 remaining?</text>
			<desc>%1 = segment index, %2 = stopped travel position, %3 = remaining duration</desc>
		</str>
    </xsl:template>

	<xsl:template match="/language[@fileType='SCH']/str[@id='48']">
	    <xsl:copy-of select="."/>
		<str id="49">
			<text>The head will have to be manually positioned to restart the weld. Restart weld at segment %1 with %2 remaining?</text>
			<desc>%1 = segment index, %2 = remaining duration</desc>
		</str>	
	</xsl:template>
	
  	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>