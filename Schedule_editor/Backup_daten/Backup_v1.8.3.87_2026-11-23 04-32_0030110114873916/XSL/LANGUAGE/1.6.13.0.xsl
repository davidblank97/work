<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/language/text[@id='60']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='61']/content">
		<content>REVERSE %1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='62']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='63']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='64']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='65']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='66']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='67']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='408']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='409']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='410']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='411']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='412']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='413']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='414']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='415']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='416']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='417']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='521']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='522']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='523']/content">
		<content>%1</content>
	</xsl:template>
	<xsl:template match="/language/text[@id='536']/content">
		<content>%1</content>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>