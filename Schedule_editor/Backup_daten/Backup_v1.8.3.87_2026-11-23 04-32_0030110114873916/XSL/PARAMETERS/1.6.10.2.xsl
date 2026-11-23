<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='266240']/short_name">
		<short_name>REMAINING</short_name>
	</xsl:template>

	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='266242']/short_name">
		<short_name>ELAPSED</short_name>
	</xsl:template>

	<xsl:template match="/Parameters[@localeID='fr-FR']/param[@id='266240']/short_name">
		<short_name>RESTANTE</short_name>
	</xsl:template>

	<xsl:template match="/Parameters[@localeID='fr-FR']/param[@id='266242']/short_name">
		<short_name>ECOULEE</short_name>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='267522']">
		<xsl:copy-of select="."/>
		<param id="200713">
			<name>SHOW DURATION CONTROL</name>
			<short_name/>
			<desc>A user setting that determines whether the duration control will be shown on the run screen.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>